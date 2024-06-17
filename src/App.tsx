import UserVideoComponent from "./components/UserVideoComponent";
import useApp from "./useApp";

const App = () => {
  const {
    username,
    mySessionId,
    session,
    mainStreamManager,
    publisher,
    subscribers,
    handleChangeUsername,
    handleChangeMySessionId,
    joinSession,
    leaveSession,
  } = useApp();

  return session ? (
    <>
      <h1>연결 완료</h1>
      <button type="button" onClick={leaveSession}>
        접속 종료
      </button>
      <h2>메인 스트림 매니저</h2>
      {mainStreamManager && (
        <UserVideoComponent streamManager={mainStreamManager} />
      )}
      <h2>퍼블리셔</h2>
      {publisher && <UserVideoComponent streamManager={publisher} />}
      <h2>다른 참가자들</h2>
      {subscribers.map((subscriber) => {
        const username = JSON.parse(
          subscriber.stream.connection.data
        ).clientData;
        const key = subscriber.stream.streamId;

        return (
          <div key={subscriber.stream.streamId}>
            <ul>
              <li>{`참가자명: ${username}`}</li>
              <li>{`key 값: ${key}`}</li>
            </ul>
            <UserVideoComponent streamManager={subscriber} />
          </div>
        );
      })}
    </>
  ) : (
    <>
      <h1>OpenVidu 화상 채팅 애플리케이션 테스트</h1>
      <p>사용자명</p>
      <input value={username} onChange={handleChangeUsername} />
      <p>세션 아이디</p>
      <input value={mySessionId} onChange={handleChangeMySessionId} required />
      <br />
      <button type="button" onClick={joinSession}>
        접속하기!
      </button>
    </>
  );
};

export default App;
