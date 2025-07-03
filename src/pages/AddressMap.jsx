/*
  AddressMap.jsx – FINAL WORKING FILE (2025‑07‑02)
  --------------------------------------------------------------
  • 자취 위치(기준점) 마커: 파란색, 크고 굵게, zIndex 1000
  • 회사/학교 선택 시 destination 좌표로 바로 마커 생성
  • 우클릭 → 확인 패널 → fetch → 자취 위치 마커 + 역세권 마커
*/

import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import StationList from '../components/StationList';
import StationDetail from '../components/StationDetail';
import useTopStations from '../hooks/useTopStations';
import useNaverMap from '../hooks/useNaverMap';

/***************** CONST *****************/
const SEOUL_BOUNDS = {
  latMin: 37.413294,
  latMax: 37.715133,
  lngMin: 126.734086,
  lngMax: 127.183887,
};
const INITIAL_CENTER = { lat: 37.5666805, lng: 126.9784147 };
const COST_RANGE = { min: 50, max: 140 };

const inSeoul = ({ lat, lng }) =>
  lat >= SEOUL_BOUNDS.latMin &&
  lat <= SEOUL_BOUNDS.latMax &&
  lng >= SEOUL_BOUNDS.lngMin &&
  lng <= SEOUL_BOUNDS.lngMax;

/**************** COMPONENT ***************/
export default function AddressMap() {
  const { state } = useLocation();
  const naver = window?.naver;
  if (!naver) console.warn('⚠️ Naver Maps SDK not loaded.');

  /** 자취 위치(회사·학교·사용자) */
  const [referenceLocation, setReferenceLocation] = useState(() => {
    const d = state?.detail?.destination;
    if (!d) return null;
    const lat = d.lat ?? d.latitude;
    const lng = d.lng ?? d.longitude;
    return lat && lng ? { lat, lng } : null;
  });

  const [livingOps, setLivingOps] = useState(state?.detail?.livingOpportunities ?? []);
  const [selectedStation, setSelectedStation] = useState(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const [pendingCoord, setPendingCoord] = useState(null); // 우클릭 잠정 좌표

  /* ---------- 지도 초기화 + 우클릭 이벤트 ---------- */
  const handleRightClick = useCallback(
    (coord) => {
      if (!coord) return;
      const lat = coord.lat();
      const lng = coord.lng();
      if (!inSeoul({ lat, lng })) {
        alert('현재는 서울 지역에서만 서비스가 가능합니다.');
        return;
      }
      setPendingCoord({ lat, lng });
    },
    []
  );

  const mapRef = useNaverMap(naver, handleRightClick, INITIAL_CENTER);

  /* ---------- 자취 위치 마커 ---------- */
  const refMarker = useRef(null);
  useEffect(() => {
    if (!naver || !mapRef.current) return;

    const markerHTML =
      `
  <div style="
    background:#66CCCC;
    padding:10px 14px;
    border-radius:9999px;
    text-align:center;
    font-size:24px;
    color:#FFFFFF;
    font-weight:bold;
    white-space:nowrap;
    border:3px solid #FFFFFF;
    box-shadow:0 0 10px rgba(0,0,0,0.5);
  ">
    회사 위치
  </div>
`;
    refMarker.current?.setMap(null);
    refMarker.current = null;

    if (referenceLocation) {
      const pos = new naver.maps.LatLng(referenceLocation.lat, referenceLocation.lng);
      refMarker.current = new naver.maps.Marker({
        position: pos,
        map: mapRef.current,
        zIndex: 1000,
        icon: { content: markerHTML, anchor: new naver.maps.Point(20, 40) },
      });
      mapRef.current.setCenter(pos);
    }
  }, [referenceLocation, naver, mapRef]);

  /* ---------- 역세권 마커 ---------- */
  const stationMarkers = useRef([]);
  const clearStations = () => {
    stationMarkers.current.forEach((m) => m.setMap(null));
    stationMarkers.current = [];
  };

  const drawStationMarker = useCallback(
    (s) => {
      const ratio = (s.totalOpportunityCost - COST_RANGE.min) / (COST_RANGE.max - COST_RANGE.min);
      const lightness = 90 - Math.max(0, Math.min(1, ratio)) * 60;
      const color = `hsl(15,100%,${lightness}%)`;
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(s.latitude, s.longitude),
        map: mapRef.current,
        icon: {
          content: `<div style="background:${color};padding:8px 12px;border-radius:9999px;color:#fff;font-weight:bold;font-size:15px;white-space:nowrap;">${s.stationName}<span style="margin:0 5px;">|</span>${s.totalOpportunityCost}만원/월</div>`,
          anchor: new naver.maps.Point(15, 30),
        },
      });
      naver.maps.Event.addListener(marker, 'click', () => {
        setSelectedStation(s);
        setPanelOpen(true);
      });
      stationMarkers.current.push(marker);
    },
    [mapRef, naver]
  );

  useEffect(() => {
    if (!naver || !mapRef.current) return;
    clearStations();
    livingOps.forEach(drawStationMarker);
  }, [livingOps, naver, drawStationMarker, mapRef]);

  /* ---------- API 호출 ---------- */
  async function fetchByCoord(lat, lng) {
    try {
      const workdays = state?.selectedWorkingDays ?? 0;
      const resp = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/opportunity?latitude=${lat}&longitude=${lng}&workdays=${workdays}`);
      const data = await resp.json();
      setLivingOps(data.livingOpportunities);
      setReferenceLocation({ lat, lng });
      setSelectedStation(null);
      setShowHint(true);
    } catch (e) {
      console.error(e);
      alert('데이터를 불러오는데 실패했습니다.');
    }
  }

  const topStations = useTopStations(livingOps);

  /* ---------- 렌더 ---------- */
  return (
    <Wrapper>
      <SidePanel $isopen={panelOpen}>
        {selectedStation ? (
          <StationDetail station={selectedStation} onBack={() => setSelectedStation(null)} />
        ) : (
          <StationList stations={topStations} onSelect={setSelectedStation} />
        )}
      </SidePanel>

      <MapDiv id="map" />

      {showHint && !pendingCoord && (
        <HintBar>
          {referenceLocation ? '역 마커를 클릭하면 상세 정보를 볼 수 있습니다.' : '우클릭으로 자취 위치를 지정하세요.'}
          <CloseBtn onClick={() => setShowHint(false)}>×</CloseBtn>
        </HintBar>
      )}

      {pendingCoord && (
        <ConfirmBox>
          <p>이 위치를 자취 위치로 설정할까요?</p>
          <ButtonRow>
            <ConfirmBtn onClick={() => { fetchByCoord(pendingCoord.lat, pendingCoord.lng); setPendingCoord(null); }}>확인</ConfirmBtn>
            <CancelBtn onClick={() => setPendingCoord(null)}>취소</CancelBtn>
          </ButtonRow>
        </ConfirmBox>
      )}
    </Wrapper>
  );
}

/***************** STYLED COMPONENTS *****************/
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

const MapDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const SidePanel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ $isopen }) => ($isopen ? '350px' : '0')};
  height: 100%;
  overflow-y: auto;
  background: #fff;
  box-shadow: ${({ $isopen }) => ($isopen ? '2px 0 5px rgba(0,0,0,0.1)' : 'none')};
  transition: width 0.25s ease-out;
  padding: ${({ $isopen }) => ($isopen ? '20px' : '0')};
  z-index: 5;
`;

const HintBar = styled.div`
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 18px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  z-index: 10;
`;

const ConfirmBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
  z-index: 11;
`;

const ButtonRow = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const Btn = styled.button`
  min-width: 80px;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
`;

const ConfirmBtn = styled(Btn)`
  background: #3182f6;
  color: #fff;
`;

const CancelBtn = styled(Btn)`
  background: #f0f0f0;
  color: #333;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;
