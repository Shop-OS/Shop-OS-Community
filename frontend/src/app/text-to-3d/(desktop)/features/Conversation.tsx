
import {
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';

import Header from '@/components/AgentHeader';
import Viewer3D from '../../components/Viewer3D/Viewer3D';
import useTextTo3D from '../../provider/useTextTo3D';
import Viewer3DGIF from '../../components/Viewer3DGIF/Viewer3DGIF';
import Rive, { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { Progress, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { error } from 'console';
import io from 'socket.io-client';
import { set } from 'js-cookie';

interface ConversationProps {
  setShouldFetch: (shouldFetch: boolean) => void;
  shouldFetch: boolean;
  agentInputComponent: string;
}

const Conversation = memo((props: ConversationProps) => {
  const socket = useRef<any>(null);
  const [clientId, setClientId] = useState<string>();
  const [queue_size, setQueueSize] = useState(0);

  const { outputImages } = useTextTo3D();
  const { RiveComponent, rive } = useRive({
    src: '/loading_drop.riv',
    stateMachines: ['percentage', 'fill'],
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      minX: 50,
      minY: 50,
      maxX: 100,
      maxY: 100,
    }),
  });

  const percentageRef = useRef<any>(0);
  percentageRef.current = useStateMachineInput(rive, 'percentage', 'percentage', 10);
  useEffect(() => {
    if (percentageRef.current) {
      if (percentageRef.current.value < 100) {
        percentageRef.current.value = percentageRef.current.value + 10;
      }
    }
  }, []);

  const { currentHistory } = useTextTo3D();


  useEffect(() => {
    const COMFY_API_URL =
      process.env.NEXT_PUBLIC_COMFY_API_URL ?? 'https://genai-devtest.houseofmodels.ai';
    socket.current = io(COMFY_API_URL, { transports: ['websocket'] });
    socket.current.on('connect', () => {
      console.log('Socket.IO connection is open now: ', socket.current.id);
      setClientId(socket.current.id);
      setInterval(() => {
        if (socket.current?.connected) {
          socket.current.emit('heartbeat', { message: 'Heartbeat from client' });
        }
      }, 10000);
    });

    socket.current.on('queue_length', (data: any) => {
      setQueueSize(data.count);
    });

    socket.current.on('disconnect', () => {
      setClientId(undefined);
      console.log('Socket.IO connection is closed now.');
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  return (
    <>
      <div
        style={{
          alignItems: 'center',
          // borderBottom: '1px solid #2E2E2E',
          display: 'flex',
          // height: '50px',
          justifyContent: 'start',
          marginBottom: 5,
          // padding: '5px',
          position: 'relative',
          width: '100%',
        }}
      >
        <Header queue_size={queue_size} showQueueSize={false} />
      </div>

      <div
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'flex-start',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'start',
            alignItems: 'start',
            flexWrap: 'wrap',
            gap: '14px',
            margin: '0 16px 16px',
            width: '100%',
          }}
        >
          {props.agentInputComponent == "history" ? <>
            {currentHistory?.items?.map((item: any, index: number) => (
              (item.downloadURL && item.downloadURL !== "") && <div
                style={{
                  backgroundColor: '#1f1f1f',
                  borderRadius: 10,
                  width: '490px',
                  height: '490px',
                  position: 'relative',
                }}
                key={`${item.origin}`}
              >
                {item.origin == "hom" ?
                  <Viewer3DGIF src={item.downloadURL} key={`${item.origin}-history-${item.downloadURL}`} />
                  :
                  <Viewer3D src={item.downloadURL} id={item.origin} key={`${item.origin}-history-${item.downloadURL}`} />
                }
              </div>)
            )}
          </> : <>
            {Object.keys(outputImages).length > 0 &&
              Object.keys(outputImages).map((key: any, index) => {
                const item = outputImages[key];
                return (
                  <div
                    style={{
                      backgroundColor: '#1f1f1f',
                      borderRadius: 10,
                      width: '490px',
                      height: '490px',
                      position: 'relative',
                    }}
                    key={`${key}-${item.progress}`}
                  >
                    {key == "comfy" ?
                      <Viewer3DGIF src={item.url} key={key} />
                      :
                      <Viewer3D src={item.url} id={key} />
                    }
                    {item.isLoading && (
                      <>
                        {/* <RiveComponent /> */}

                        {/* <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        height: "100px",
                        width: "100px",
                        position: "absolute",
                        top: "40%",
                        left: "40%",
                      }}>
                        <Rive
                          src="/loading_drop.riv"
                          stateMachines={["percentage", "fill"]}
                        />
                      </div> */}
                        {key == "comfy" && <div
                          style={{
                            fontFamily: 'BDO Grotesk, sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            padding: '8px 16px',
                            marginLeft: 'auto',

                          }}
                        >
                          Queue Size: {queue_size}
                        </div>}
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#1f1f1f',
                            opacity: 0.5,
                            borderRadius: 10,
                          }}
                        >
                          <Progress type="circle" percent={item.progress} size={80} strokeColor={'white'} />
                          <div style={{ marginTop: 15 }}>
                            {item.outputText ?? "You are in queue"}
                            <span className="typewriter">&hellip;</span>
                          </div>
                          <style jsx>
                            {`
                    .typewriter {
                      overflow: hidden;
                      white-space: nowrap;
                      letter-spacing: 0.05em;
                      padding-top: 8px;
                      animation:
                        typing 0.75s steps(3, end) alternate infinite,
                        blink-caret 0.3s step-end infinite;
                    }

                    @keyframes typing {
                      0% {
                        width: 0;
                      }

                      80% {
                        width: 3ch;
                      }

                      100% {
                        width: 3ch;
                      }
                    }
                  `}
                          </style>
                        </div>
                        {/* <Spin
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bottom: 0,
                          left: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#1f1f1f',
                          opacity: 0.5,
                          borderRadius: 10,
                        }}
                        indicator={<LoadingOutlined style={{ fontSize: 54 }} spin />}
                      /> */}
                      </>
                    )}
                    {item.error && (
                      <>
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#1f1f1f',
                            opacity: 0.5,
                            borderRadius: 10,
                          }}
                        >
                          {"Something went wrong"}
                        </div>
                      </>
                    )}
                  </div>
                )
              })
            }
          </>
          }
        </div>
        <div style={{ display: 'none' }} id="dummyButton"></div>
      </div>
    </>
  );
});

export default Conversation;
