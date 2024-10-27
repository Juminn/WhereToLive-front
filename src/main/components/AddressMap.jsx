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
  width: ${({ isOpen }) => (isOpen ? "auto" : "0")};
  max-width: 50vw;
  background: white;
  overflow-x: scroll;
  transition: width 0.3s ease-out;
  z-index: 5;
  padding-left: ${({ isOpen }) => (isOpen ? "1vw" : "0")};
  padding-right: ${({ isOpen }) => (isOpen ? "1vw" : "0")};
  border-right: 2px solid #ccc;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const AddressMap = () => {
  const location = useLocation();
  const [destination, setDestination] = useState();
  const [livingOpportunities, setLivingOpportunities] = useState();

  useEffect(() => {
    if (location.state?.settings) {
      setSettings(location.state.settings);
    }

    if (location.state?.detail) {
      setLivingOpportunities(location.state.detail.livingOpportunities);
      setDestination(location.state.detail.destination);
    }
  }, [location.state]);

  const [settings, setSettings] = useState({
    walkingCost: "20000",
    busCost: "14000",
    subwayCost: "10000",
    transferCost: "4000",
  });

  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const leftPanelRef = useRef();

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

  const { mapRef, startMarkerRef, endMarkerRef, contextMenuWindowRef } = useMap(
    createAndShowMapContextMenu
  );

  function createAndShowMapContextMenu(latlng) {
    contextMenuWindowRef.current.setContent(contextMenuHtml);
    contextMenuWindowRef.current.open(mapRef.current, latlng);

    const startButton = document.getElementById("startButton");
    const endButton = document.getElementById("endButton");
  }

  const markersRef = useRef([]);
  const [markersAdded, setMarkersAdded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || markersAdded) return;

    if (livingOpportunities != null && livingOpportunities.length > 0) {
      // 기존 마커 제거
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current = [];

      livingOpportunities.forEach((station) => {
        const position = new naver.maps.LatLng(
          station.latitude,
          station.longitude
        );

        // totalOpportunityCost에 따른 색상 계산
        const cost = station.totalOpportunityCost;
        const minCost = 30;
        const maxCost = 100;

        // 비용 값을 0에서 1 사이의 값으로 변환
        const intensity = (cost - minCost) / (maxCost - minCost);
        const boundedIntensity = Math.max(0, Math.min(1, intensity));

        // 색상 계산 (주황색 계열, 비용이 높을수록 진한 색)
        const hue = 15; // 주황색 계열의 hue 값
        const lightness = 90 - boundedIntensity * 60; // 90%에서 30%까지 감소
        const markerColor = `hsl(${hue}, 100%, ${lightness}%)`;

        // 마커 콘텐츠 생성 (글씨 크기 2배로)
        const markerContent = `
          <div style="
            background-color: ${markerColor};
            padding: 8px 12px;
            border-radius: 9999px;
            text-align: center;
            font-size: 15px; /* 글씨 크기 2배로 */
            color: white;
            white-space: nowrap;
            font-weight: bold;
          ">
            ${station.stationName}
            <span style="margin: 0 5px;">|</span>
            ${station.totalOpportunityCost}만원/월
          </div>
        `;

        const marker = new naver.maps.Marker({
          position: position,
          map: mapRef.current,
          icon: {
            content: markerContent,
            anchor: new naver.maps.Point(15, 30),
          },
        });

        markersRef.current.push(marker);
      });

      // 도착지 마커 추가
      if (destination) {
        const destPosition = new naver.maps.LatLng(
          destination.lat,
          destination.lng
        );

        const destMarkerContent = `
          <div style="
            background-color: #66CCCC; /* 보기편한청록 */
            padding: 10px 14px;
            border-radius: 9999px;
            text-align: center;
            font-size: 24px; /* 글씨 크기 2배로 */
            color: white;
            white-space: nowrap;
            font-weight: bold;
            border: 3px solid #FFFFFF; /* 흰색 테두리 */
            box-shadow: 0 0 10px rgba(0,0,0,0.5); /* 그림자 */
          ">
            ${destination.name}
          </div>
        `;

        const destMarker = new naver.maps.Marker({
          position: destPosition,
          map: mapRef.current,
          icon: {
            content: destMarkerContent,
            anchor: new naver.maps.Point(15, 30),
          },
          zIndex: 100, // 다른 마커보다 위에 표시되도록
        });

        markersRef.current.push(destMarker);
      }

      setMarkersAdded(true);
    }
  }, [mapRef.current, markersAdded, livingOpportunities, destination]);

  return (
    <PageLayout>
      <LeftPanel isOpen={isPanelOpen} ref={leftPanelRef}>
        {destination && destination.name}
        {/* 왼쪽 패널 내용 */}
      </LeftPanel>

      <MapContainer>
        <div id="map" style={{ width: "100%", height: "100vh" }}></div>
      </MapContainer>
    </PageLayout>
  );
};

export default AddressMap;
