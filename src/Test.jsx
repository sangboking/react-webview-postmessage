import { useEffect, useState } from "react";
import styled from "styled-components";

const Test = () => {
  const [allDevices, setAllDevices] = useState(null);
  const [connectedDevice, setConnectedDevice] = useState(null);

  //RN 으로부터 넘어오는 데이터 처리 로직
  useEffect(() => {
    const handleMessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "allDevices") {
        setAllDevices(data.data);
      }

      if (data.type === "connectedDevice") {
        setConnectedDevice(data.data);
      }
    };

    //ios
    window.addEventListener("message", handleMessage);

    //android
    document.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage);
    };
  }, []);

  // WebView -> RN 으로 데이터 전달(기기 연결, 해제 를 해달라는 type값과 기기 id 전달)
  const hanldeClickWebToApp = (type, id) => {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ type: type, id: id })
    );
  };

  return (
    <Wrapper>
      <Title>스캔된 장치 리스트</Title>
      {allDevices &&
        allDevices.map((el, i) => (
          <FlexBox key={i}>
            <ColummBox>
              <div>{el.id}</div>
              <div>{el.name}</div>
            </ColummBox>
            <button onClick={() => hanldeClickWebToApp("connect", el.id)}>
              연결
            </button>
          </FlexBox>
        ))}

      <DivLine />

      <Title>연결된 장치</Title>
      {connectedDevice && (
        <FlexBox>
          <ColummBox>
            <div>{connectedDevice.id}</div>
            <div>{connectedDevice.name}</div>
          </ColummBox>
          <button
            onClick={() =>
              hanldeClickWebToApp("disconnect", connectedDevice.id)
            }
          >
            해제
          </button>
        </FlexBox>
      )}
    </Wrapper>
  );
};

export default Test;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

const FlexBox = styled.div`
  display: flex;
  gap: 1rem;
`;

const ColummBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 1rem;
`;

const DivLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: black;
  margin-top: 0.5rem;
`;
