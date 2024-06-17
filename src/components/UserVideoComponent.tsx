import OpenViduVideoComponent from "./OvVideo";
import type { StreamManager } from "openvidu-browser";

interface UserVideoComponentProps {
  streamManager: StreamManager;
}

const UserVideoComponent = ({ streamManager }: UserVideoComponentProps) => {
  const nicknameTag = JSON.parse(
    streamManager.stream.connection.data
  ).clientData;

  return (
    <div>
      {streamManager !== undefined && (
        <div>
          <OpenViduVideoComponent streamManager={streamManager} />
          <div>
            <p>참가자명: {nicknameTag}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserVideoComponent;
