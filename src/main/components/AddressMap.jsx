import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

import { useMap } from "../hooks/useMap";
import { FaSubway, FaMoneyBillWave, FaClock, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

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
  width: ${({ isOpen }) => (isOpen ? "350px" : "0")};
  background: white;
  overflow-y: auto;
  transition: width 0.3s ease-out;
  z-index: 5;
  padding: ${({ isOpen }) => (isOpen ? "20px" : "0")};
  box-shadow: ${({ isOpen }) => (isOpen ? "2px 0 5px rgba(0,0,0,0.1)" : "none")};
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const StationInfoCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  background: #fafafa;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;

  & > svg {
    margin-right: 8px;
    color: #007BFF;
  }
`;

const InfoItem = styled.p`
  margin: 5px 0;
  font-size: 16px;
  line-height: 1.4;

  & > strong {
    color: #555;
  }
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
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];

    if (livingOpportunities != null && livingOpportunities.length > 0) {
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

        // 마커 콘텐츠 생성
        const markerContent = `
          <div style="
            background-color: ${markerColor};
            padding: 8px 12px;
            border-radius: 9999px;
            text-align: center;
            font-size: 15px;
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

        naver.maps.Event.addListener(marker, 'click', () => {
          setSelectedStation(station);
          setIsPanelOpen(true);
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
            background-color: #66CCCC;
            padding: 10px 14px;
            border-radius: 9999px;
            text-align: center;
            font-size: 24px;
            color: white;
            white-space: nowrap;
            font-weight: bold;
            border: 3px solid #FFFFFF;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
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
          zIndex: 100,
        });

        markersRef.current.push(destMarker);
      }
    }
  }, [mapRef.current, livingOpportunities, destination]);

  return (
    <PageLayout>
      <LeftPanel isOpen={isPanelOpen} ref={leftPanelRef}>
        {selectedStation ? (
          <StationInfoCard>
            <Section>
              <SectionTitle><FaSubway /> 기본 정보</SectionTitle>
              <InfoItem>
                <strong>역명:</strong> {selectedStation.stationName}
              </InfoItem>
              <InfoItem>
                <strong>노선:</strong> {selectedStation.line}
              </InfoItem>
            </Section>
            <Section>
              <SectionTitle><FaMoneyBillWave /> 비용 정보</SectionTitle>
              <InfoItem>
                <strong>평균 월세 비용:</strong> {selectedStation.rentCost}만원
              </InfoItem>
              <InfoItem>
                <strong>회사 통근 기회비용:</strong> {selectedStation.commuteCost}만원
              </InfoItem>
              <InfoItem>
                <strong>실제 거주 기회비용:</strong> {selectedStation.totalOpportunityCost}만원
              </InfoItem>
            </Section>
            <Section>
              <SectionTitle><FaClock /> 통근 정보</SectionTitle>
              <InfoItem>
                <strong>통근 시간:</strong> {selectedStation.commuteTime}분
              </InfoItem>
            </Section>
            <Section>
              <SectionTitle><FaThumbsUp /> 장점</SectionTitle>
              <InfoItem>{selectedStation.pros}</InfoItem>
            </Section>
            <Section>
              <SectionTitle><FaThumbsDown /> 단점</SectionTitle>
              <InfoItem>{selectedStation.cons}</InfoItem>
            </Section>
          </StationInfoCard>
        ) : (
          destination && (
            <div style={{ padding: '20px' }}>
              <h2>{destination.name}</h2>
            </div>
          )
        )}
      </LeftPanel>

      <MapContainer>
        <div id="map" style={{ width: "100%", height: "100vh" }}></div>
      </MapContainer>
    </PageLayout>
  );
};

export default AddressMap;
