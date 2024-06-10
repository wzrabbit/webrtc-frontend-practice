import useApp from "./useApp";

const App = () => {
  const {
    username,
    mySessionId,
    handleChangeUsername,
    handleChangeMySessionId,
  } = useApp();

  return (
    <>
      <h1>OpenVidu 화상 채팅 애플리케이션 테스트</h1>
      <p>사용자명</p>
      <input value={username} onChange={handleChangeUsername} />
      <p>세션 아이디</p>
      <input value={mySessionId} onChange={handleChangeMySessionId} required />
      <br />
      <button type="button">접속하기!</button>
    </>
  );
};

export default App;
