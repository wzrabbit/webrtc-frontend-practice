import { useRef, useEffect } from "react";

interface OpenViduVideoComponentProps {
  streamManager: any;
}

const OpenViduVideoComponent = ({
  streamManager,
}: OpenViduVideoComponentProps) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const $videoElement = videoRef.current;

    if (!$videoElement) {
      return;
    }

    streamManager.addVideoElement($videoElement);
  }, [streamManager, videoRef]);

  return <video autoPlay={true} ref={videoRef} />;
};

export default OpenViduVideoComponent;
