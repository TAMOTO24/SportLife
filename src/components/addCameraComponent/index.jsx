// PeerCamera.js
import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { socket } from "../../function";

const PeerCamera = ({ roomId, isHost }) => {
  const localVideoRef = useRef(null);
  const [peer, setPeer] = useState(null);
  const peersRef = useRef({});

  useEffect(() => {
    // ! Important: Ensure that the PeerJS server is running on the specified host and port
    // ! Error: if owner of the room reloads the page, the viewer will not be able to see the stream
    const newPeer = new Peer(undefined, {
      host: "localhost",
      port: 9000,
      path: "/peerjs",
    });

    setPeer(newPeer);

    newPeer.on("open", (id) => {
      socket.emit("join-stream", { roomId, userId: id });
    });

    return () => {
      newPeer.destroy();
    };
  }, [roomId]);

  useEffect(() => {
    if (!peer) return;

    if (isHost) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          console.log("🎥 Stream obtained by host:", mediaStream);
          if (localVideoRef.current) {
            console.log("🎬 Stream set to host video element");
            localVideoRef.current.srcObject = mediaStream;
          }

          socket.on("user-connected", (userId) => {
            console.log("📡 New viewer connected:", userId);
            const call = peer.call(userId, mediaStream);
            peersRef.current[userId] = call;
          });
        });
    } else {
      peer.on("call", (call) => {
        console.log("📞 Incoming call from host");
        call.answer();
        call.on("stream", (remoteStream) => {
          if (localVideoRef.current) {
            console.log("📺 Stream set to viewer video element");
            localVideoRef.current.srcObject = remoteStream;
            console.log("📺 Remote stream received:", remoteStream);
            localVideoRef.current.onloadedmetadata = () => {
              localVideoRef.current
                .play()
                .catch((err) =>
                  console.error(
                    "🔴 Error playing video after metadata loaded:",
                    err
                  )
                );
            };
          }
        });
      });
    }

    socket.on("user-disconnected", (userId) => {
      if (peersRef.current[userId]) {
        peersRef.current[userId].close();
        delete peersRef.current[userId];
      }
    });
  }, [peer, isHost]);

  return (
    <div>
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "50%" }}
      />
    </div>
  );
};

export default PeerCamera;
