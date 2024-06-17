import { useState, useEffect, useRef, useCallback } from "react";
import type { ChangeEventHandler } from "react";
import getToken from "./domains/getToken";
import { OpenVidu } from "openvidu-browser";
import type {
  Session,
  StreamManager,
  Publisher,
  Subscriber,
  Device,
} from "openvidu-browser";

const useApp = () => {
  const [username, setUsername] = useState("");
  const [mySessionId, setMySessionId] = useState("");
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [mainStreamManager, setMainStreamManager] = useState<
    StreamManager | undefined
  >(undefined);
  const [publisher, setPublisher] = useState<Publisher | undefined>(undefined);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState<
    Device | undefined
  >(undefined);

  console.log(subscribers);

  const openVidu = useRef<OpenVidu | null>();

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

  const joinSession = async () => {
    openVidu.current = new OpenVidu();
    const newSession = openVidu.current.initSession();

    newSession.on("streamCreated", (event) => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((subscribers) => [...subscribers, subscriber]);
    });

    newSession.on("streamDestroyed", (event) => {
      setSubscribers((subscribers) =>
        subscribers.filter(
          (subscriber) =>
            subscriber.stream.streamManager !== event.stream.streamManager
        )
      );
    });

    newSession.on("exception", (exception) => {
      console.warn(`예외 발생: ${exception}`);
    });

    const token = await getToken(mySessionId);

    newSession
      .connect(token, { clientData: username })
      .then(async () => {
        const publisher = await openVidu.current?.initPublisherAsync(
          undefined,
          {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: "640x480",
            frameRate: 30,
            insertMode: "APPEND",
            mirror: false,
          }
        );

        if (!publisher) {
          return;
        }

        newSession.publish(publisher);

        const devices = await openVidu.current?.getDevices();
        const videoDevices = devices?.filter(
          (device) => device.kind === "videoinput"
        );
        const currentVideoDeviceId = publisher.stream
          .getMediaStream()
          .getVideoTracks()[0]
          .getSettings().deviceId;
        const currentVideoDevice = videoDevices?.find(
          (device) => device.deviceId === currentVideoDeviceId
        );

        setCurrentVideoDevice(currentVideoDevice);
        setMainStreamManager(publisher);
        setPublisher(publisher);
      })
      .catch((error) => {
        console.log("세션 연결에 실패했습니다.", error.code, error.message);
      });

    setSession(newSession);
  };

  const leaveSession = useCallback(() => {
    if (session) {
      session.disconnect();
    }

    openVidu.current = null;

    setSession(undefined);
    setSubscribers([]);
    setMainStreamManager(undefined);
    setPublisher(undefined);
  }, [session]);

  useEffect(() => {
    document.addEventListener("beforeunload", leaveSession);

    return () => {
      document.removeEventListener("beforeunload", leaveSession);
    };
  }, [leaveSession]);

  return {
    username,
    mySessionId,
    session,
    mainStreamManager,
    publisher,
    subscribers,
    currentVideoDevice,
    handleChangeUsername,
    handleChangeMySessionId,
    joinSession,
    leaveSession,
  };
};

export default useApp;
