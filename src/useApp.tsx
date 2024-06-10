import { useState } from "react";
import type { ChangeEventHandler } from "react";

const useApp = () => {
  const [username, setUsername] = useState("");
  const [mySessionId, setMySessionId] = useState("");

  const handleChangeUsername: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setUsername(event.target.value);
  };

  const handleChangeMySessionId: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setMySessionId(event.target.value);
  };

  return {
    username,
    mySessionId,
    handleChangeUsername,
    handleChangeMySessionId,
  };
};

export default useApp;
