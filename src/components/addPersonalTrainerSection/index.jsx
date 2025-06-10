import { useState, useEffect } from "react";
import axios from "axios";
import PersonalTrainer_User from "../addPersonalTrainerUserBlock";
import PersonalTrainerBlock from "../addPersonalTrainerBlock";

const PersonalTrainer = ({ user }) => {
  const [client, setClient] = useState(undefined);

  useEffect(() => {
    axios
      .get(`/userbyid/${user?.clientId || user?.personalTrainerId}`)
      .then((response) => setClient(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      {user?.role === "trainer" ? (
        <PersonalTrainerBlock user={client} />
      ) : (
        <PersonalTrainer_User user={user} trainer={client} />
      )}
    </>
  );
};

export default PersonalTrainer;
