import { useState, useEffect } from "react";
import axios from "axios";
import PersonalTrainer_User from "../addPersonalTrainerUserBlock";
import PersonalTrainerBlock from "../addPersonalTrainerBlock";

const PersonalTrainer = ({ user }) => {
  const [client, setClient] = useState(undefined);

  useEffect(() => {
    axios
      .get(`/userbyid/${user?.clientId || user?.personalTrainerId}`)
      .then((response) => {
        setClient(response.data);
        console.log(response.data.statistic);
      })
      .catch((error) => console.error(error));
  }, []);

  console.log("Client", client, user?.clientId)

  return (
    <>
      {user?.role === "trainer" ? (
        <PersonalTrainerBlock user={client} />
      ) : (
        <PersonalTrainer_User user={client} />
      )}
    </>
  );
};

export default PersonalTrainer;
