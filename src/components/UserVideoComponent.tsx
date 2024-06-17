import OpenViduVideoComponent from "./OvVideo";
import type { StreamManager } from "openvidu-browser";

interface UserVideoComponentProps {
  streamManager: StreamManager;
}

const UserVideoComponent = ({ streamManager }: UserVideoComponentProps) => {
  return (
    <div>
      {streamManager !== undefined && (
        <OpenViduVideoComponent streamManager={streamManager} />
      )}
    </div>
  );
};

export default UserVideoComponent;
