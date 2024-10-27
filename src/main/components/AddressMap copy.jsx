import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

import { useMap } from "../hooks/useMap";

const PageLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  //min-width: ${({ isOpen }) => (isOpen ? "30vw" : "0")};
  width: ${({ isOpen }) => (isOpen ? "auto" : "0")};
  max-width: 50vw;
  background: white; // 배경색 추가
  overflow-x: scroll; // 내용이 넘칠 경우 스크롤
  transition: width 0.3s ease-out;
  z-index: 5; // 지도 위에 오도록 z-index 설정

  padding-left: ${({ isOpen }) => (isOpen ? "1vw" : "0")}; // 왼쪽 여백 추가
  padding-right: ${({ isOpen }) => (isOpen ? "1vw" : "0")}; // 왼쪽 여백 추가

  border-right: 2px solid #ccc; /* 오른쪽 경계선 추가 */
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const AddressMap = () => {
  const location = useLocation();

  const [settings, setSettings] = useState({
    walkingCost: "20000",
    busCost: "14000",
    subwayCost: "10000",
    transferCost: "4000",
  });

  const [isPanelOpen, setIsPanelOpen] = useState(true); // 패널 상태 관리를 위한 상태

  // 레프트 패널의 Ref를 생성합니다.
  const leftPanelRef = useRef();

  // 새로운 설정값을 받으면 상태를 업데이트합니다.
  useEffect(() => {
    if (location.state?.settings) {
      setSettings(location.state.settings);
    }
  }, [location.state]);

  // 패널 토글 함수
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const naver = window.naver;
  const contextMenuHtml = [
    '<div style="padding:10px;min-width:100px;line-height:150%;">',
    '   <button id="startButton" >출발</button>',
    '   <button id="endButton" >도착</button>',
    "</div>",
  ].join("\n");
 
  //네이버지도 초기화, 지도 context menu추가
  const { mapRef, startMarkerRef, endMarkerRef, contextMenuWindowRef } = useMap(
    createAndShowMapContextMenu
  );

  //지도 우클릭 메뉴 만들기/보여주기
  function createAndShowMapContextMenu(latlng) {
    //메뉴를 보여주기
    contextMenuWindowRef.current.setContent(contextMenuHtml);
    contextMenuWindowRef.current.open(mapRef.current, latlng);

    //메뉴의 버튼 만들기
    const startButton = document.getElementById("startButton");
    const endButton = document.getElementById("endButton");

  }

  return (
    <PageLayout>
      <LeftPanel isOpen={isPanelOpen} ref={leftPanelRef}>
        
        hiiaaaaaaaaaaaaaaaaaaaaaaaaaaaa

      </LeftPanel>

      <MapContainer>
        <div id="map" style={{ width: "100%", height: "100vh" }}></div>
      </MapContainer>

    
    </PageLayout>
  );
};

export default AddressMap;
