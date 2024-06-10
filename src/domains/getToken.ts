import axios from "axios";

const APPLICATION_SERVER_URL = "http://localhost:5000";

const getToken = async (mySessionId: string): Promise<string> => {
  const sessionId = await createSession(mySessionId);
  const token = await createToken(sessionId);

  return token;
};

const createSession = async (mySessionId: string): Promise<string> => {
  const response = await axios.post(
    `${APPLICATION_SERVER_URL}/api/sessions`,
    {
      customSessionId: mySessionId,
    },
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data;
};

const createToken = async (sessionId: string): Promise<string> => {
  const response = await axios.post(
    `${APPLICATION_SERVER_URL}/api/sessions/${sessionId}/connections`,
    {},
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data;
};

export default getToken;
