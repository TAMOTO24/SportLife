// PeerCamera.js
import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { socket } from "../../function";
import Draggable from "react-draggable";

const PeerCamera = ({ roomId, isHost, access }) => {
  const localVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [peer, setPeer] = useState(null);
  const peersRef = useRef({});

  const createNewPeer = () => {
    // create a new peer instance
    const newPeer = new Peer(undefined, {
      host: "localhost",
      port: 9000,
      path: "/peerjs",
    });

    newPeer.on("open", (id) => {
      socket.emit("join-stream", { roomId, userId: id, isHost });
    });

    return newPeer;
  };

  useEffect(() => {
    // create first new peer
    const newPeer = createNewPeer();

    setPeer(newPeer);

    return () => {
      newPeer.destroy();
    };
  }, [roomId]);

  useEffect(() => {
    if (!peer) return;

    if (isHost) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((mediaStream) => {
          mediaStreamRef.current = mediaStream;

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = mediaStream;
          }

          socket.on("user-connected", (userId) => {
            const call = peer.call(userId, mediaStream);
            peersRef.current[userId] = call;
          });
          socket.emit("host-available", peer.id);
        });
    } else {
      peer.on("call", (call) => {
        call.answer();
        call.on("stream", (remoteStream) => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = remoteStream;
            localVideoRef.current.onloadedmetadata = () => {
              localVideoRef.current
                .play()
                .catch((err) => console.error("🔴 Error playing video:", err));
            };
          }
        });
      });
      socket.on("host-available", (hostPeerId) => {
        const newPeer = createNewPeer();
        setPeer(newPeer);

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => {
            track.stop();
          });
        }
        newPeer.on("open", () => {
          const call = newPeer.call(hostPeerId, null);
          if (!call) return;

          call.on("stream", (remoteStream) => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = remoteStream;
              localVideoRef.current.onloadedmetadata = () => {
                localVideoRef.current.play().catch(console.error);
              };
            }
          });
        });
      });
    }
    
    return () => {
      socket.off("user-connected");
      socket.off("host-available");

      if (peer) {
        peer.destroy();
        console.log("👋 Peer connection closed", peer);
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [peer, socket, isHost]);

  if (!access) return;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        pointerEvents: "none",
      }}
    >
      <Draggable bounds="parent">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          defaultValue={{ x: 10, y: 10 }}
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            height: "25vh",
            borderRadius: "20px",
            cursor: "grab",
            pointerEvents: "auto",
          }}
        />
      </Draggable>
    </div>
  );
};

export default PeerCamera;
