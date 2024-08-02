import { useState, useRef, useEffect } from "react";
import type {
  StreamManager,
  StreamPropertyChangedEvent,
} from "openvidu-browser";

interface OpenViduVideoComponentProps {
  streamManager: StreamManager;
}

const OpenViduVideoComponent = ({
  streamManager,
}: OpenViduVideoComponentProps) => {
  const [isVideoActive, setIsVideoActive] = useState(
    streamManager.stream.videoActive
  );
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const updateVideoActive = (event: StreamPropertyChangedEvent) => {
      const videoActive = event.stream.videoActive;

      if (event.changedProperty === "videoActive") {
        setIsVideoActive(videoActive);
      }
    };

    const updateStartSpeaking = () => {
      setIsUserSpeaking(true);
    };

    const updateStopSpeaking = () => {
      setIsUserSpeaking(false);
    };

    streamManager.on("streamPropertyChanged", updateVideoActive);
    streamManager.on("publisherStartSpeaking", updateStartSpeaking);
    streamManager.on("publisherStopSpeaking", updateStopSpeaking);
    return () => {
      streamManager.off("streamPropertyChanged", updateVideoActive);
      streamManager.off("publisherStartSpeaking", updateStartSpeaking);
      streamManager.off("publisherStopSpeaking", updateStopSpeaking);
    };
  }, [streamManager]);

  useEffect(() => {
    const $videoElement = videoRef.current;

    if (!$videoElement) {
      return;
    }

    streamManager.addVideoElement($videoElement);
  }, [streamManager]);

  return (
    <>
      <video
        autoPlay={true}
        ref={videoRef}
        style={{
          boxShadow: `${isUserSpeaking ? "0 0 30px green" : "0 0 0px green"}`,
          scale: `${isUserSpeaking ? "1.02" : "1"}`,
          transition: "0.2s",
        }}
      />
      <div>현재 참가자의 상태</div>
      <ul>
        <li>{`isVideoActive: ${isVideoActive}`}</li>
        <li>{`speaking: ${isUserSpeaking}`}</li>
      </ul>
    </>
  );
};

export default OpenViduVideoComponent;
