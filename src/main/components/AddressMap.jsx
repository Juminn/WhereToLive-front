import React, { useEffect, useRef, useState } from "react";

import styled from "styled-components";

import { useLocation } from "react-router-dom";

import {
  FaSubway,
  FaMoneyBillWave,
  FaClock,
  FaThumbsUp,
  FaThumbsDown,
  FaChevronDown,
  FaChevronUp,
  FaArrowLeft,
} from "react-icons/fa";

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

  box-shadow: ${({ isOpen }) =>
    isOpen ? "2px 0 5px rgba(0,0,0,0.1)" : "none"};
`;

const MapContainer = styled.div`
  width: 100%;

  height: 100%;
`;

const StationCard = styled.div`
  border: 1px solid #eee;

  border-radius: 8px;

  margin-bottom: 10px;

  background: #fff;
`;

const StationHeader = styled.div`
  padding: 15px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  cursor: pointer;
`;

const StationTitle = styled.h3`
  margin: 0;

  font-size: 18px;

  color: #333;
`;

const StationInfo = styled.div`
  padding: 15px;

  background: #fafafa;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  display: flex;

  align-items: center;

  font-size: 16px;

  margin-bottom: 10px;

  color: #333;

  & > svg {
    margin-right: 8px;

    color: #007bff;
  }
`;

const InfoItem = styled.p`
  margin: 5px 0;

  font-size: 14px;

  line-height: 1.4;

  & > strong {
    color: #555;
  }
`;

const InstructionOverlay = styled.div`
  position: absolute;

  top: 10px;

  left: 50%;

  transform: translateX(-50%);

  background: rgba(255, 255, 255, 0.9);

  padding: 10px 20px;

  border-radius: 20px;

  z-index: 10;

  font-size: 16px;

  color: #333;

  display: flex;

  align-items: center;
`;

const LAT_MIN = 37.413294;

const LAT_MAX = 37.715133;

const LON_MIN = 126.734086;

const LON_MAX = 127.183887;

const AddressMap = () => {
  const location = useLocation();

  const [destination, setDestination] = useState();

  const [livingOpportunities, setLivingOpportunities] = useState();

  const [selectedStation, setSelectedStation] = useState(null);

  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const [showInstruction, setShowInstruction] = useState(true);

  const [topStations, setTopStations] = useState([]);

  const [expandedStations, setExpandedStations] = useState([]);

  const [showTopList, setShowTopList] = useState(true);

  const naver = window.naver;

  const mapRef = useRef();

  const markersRef = useRef([]); // 역 마커들을 관리

  const contextMenuWindowRef = useRef();

  const destMarkerRef = useRef(); // 도착지 마커

  const companyMarkerRef = useRef(); // 회사 마커

  const contextMenuHtml = `

    <div style="

      background-color: white;

      padding: 10px;

      min-width: 150px;

      border: 1px solid #ccc;

      border-radius: 5px;

      box-shadow: 2px 2px 5px rgba(0,0,0,0.3);

    ">

      <button id="selectLocationButton" style="

        width: 100%;

        padding: 10px;

        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

        color: #fff;

        border: none;

        border-radius: 5px;

        font-size: 16px;

        cursor: pointer;

      ">

        위치 지정하기

      </button>

    </div>

  `;

  useEffect(() => {
    if (!mapRef.current) {
      // 지도 초기화

      mapRef.current = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(37.5666805, 126.9784147),

        zoom: 10,
      });

      // 컨텍스트 메뉴 초기화

      contextMenuWindowRef.current = new naver.maps.InfoWindow({
        content: "",

        borderWidth: 0,

        disableAnchor: true,

        backgroundColor: "transparent",

        pixelOffset: new naver.maps.Point(0, 0),
      });

      // 우클릭 이벤트 리스너 추가

      naver.maps.Event.addListener(mapRef.current, "rightclick", function (e) {
        createAndShowMapContextMenu(e.coord);
      });
    }

    if (location.state?.detail) {
      setLivingOpportunities(location.state.detail.livingOpportunities);

      setDestination(location.state.detail.destination);

      // 회사 마커 생성

      if (location.state.detail.destination) {
        if (companyMarkerRef.current) {
          companyMarkerRef.current.setMap(null);
        }

        const destPosition = new naver.maps.LatLng(
          location.state.detail.destination.lat,

          location.state.detail.destination.lng
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

            ${location.state.detail.destination.name}

          </div>

        `;

        companyMarkerRef.current = new naver.maps.Marker({
          position: destPosition,

          map: mapRef.current,

          icon: {
            content: destMarkerContent,

            anchor: new naver.maps.Point(15, 30),
          },

          zIndex: 100,
        });

        // 회사 마커를 markersRef에 추가하지 않습니다.
      }
    }
  }, [location.state]);

  useEffect(() => {
    const timer = setTimeout(() => setShowInstruction(false), 5000);

    return () => clearTimeout(timer);
  }, [showInstruction]);

  // 실제 거주 기회비용이 낮은 10개 역 추출

  useEffect(() => {
    if (livingOpportunities) {
      // 역 이름 중복 제거

      const uniqueStations = livingOpportunities.reduce((acc, current) => {
        const x = acc.find((item) => item.stationName === current.stationName);

        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      const sortedStations = uniqueStations.sort(
        (a, b) => a.totalOpportunityCost - b.totalOpportunityCost
      );

      setTopStations(sortedStations.slice(0, 10));
    }
  }, [livingOpportunities]);

  function createAndShowMapContextMenu(latlng) {
    contextMenuWindowRef.current.setContent(contextMenuHtml);

    contextMenuWindowRef.current.open(mapRef.current, latlng);

    const selectLocationButton = document.getElementById(
      "selectLocationButton"
    );

    selectLocationButton.onclick = () => {
      contextMenuWindowRef.current.close();

      // 선택한 위치가 서울 범위 내에 있는지 확인

      if (
        latlng.lat() < LAT_MIN ||
        latlng.lat() > LAT_MAX ||
        latlng.lng() < LON_MIN ||
        latlng.lng() > LON_MAX
      ) {
        alert("현재는 서울 지역에서만 서비스가 가능합니다.");

        return;
      }

      // 기존 도착지 마커 제거

      if (destMarkerRef.current) {
        destMarkerRef.current.setMap(null);

        destMarkerRef.current = null;
      }

      // 회사 마커 제거

      if (companyMarkerRef.current) {
        companyMarkerRef.current.setMap(null);

        companyMarkerRef.current = null;
      }

      // 역 마커 제거

      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });

      markersRef.current = [];

      // 선택한 위치에 도착지 마커 생성

      destMarkerRef.current = new naver.maps.Marker({
        position: latlng,

        map: mapRef.current,

        icon: {
          content: `

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

              선택한 위치

            </div>

          `,

          anchor: new naver.maps.Point(15, 30),
        },

        zIndex: 100,
      });

      // 도착지 마커를 markersRef에 추가하지 않습니다.

      // API 요청

      const apiUrl = process.env.REACT_APP_API_ENDPOINT;

      const workDays = location.state.selectedWorkingDays;

      fetch(
        `${apiUrl}/opportunity?latitude=${latlng.lat()}&longitude=${latlng.lng()}&workdays=${workDays}`
      )
        .then((response) => response.json())

        .then((data) => {
          setLivingOpportunities(data.livingOpportunities);

          //setDestination(data.destination); //실제 위치 확인

          setSelectedStation(null);

          setExpandedStations([]);

          setShowTopList(true);

          setTopStations([]);

          // 모든 마커를 보여줄 수 있도록 맵 조정

          const bounds = new naver.maps.LatLngBounds();

          data.livingOpportunities.forEach((station) => {
            bounds.extend(
              new naver.maps.LatLng(station.latitude, station.longitude)
            );
          });

          bounds.extend(latlng);

          mapRef.current.fitBounds(bounds);

          // 위치를 지정할 때마다 안내 메시지 표시

          setShowInstruction(true);
        })

        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };
  }

  useEffect(() => {
    if (!mapRef.current) return;

    // 기존 역 마커 제거

    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });

    markersRef.current = [];

    if (livingOpportunities && livingOpportunities.length > 0) {
      livingOpportunities.forEach((station) => {
        const position = new naver.maps.LatLng(
          station.latitude,

          station.longitude
        );

        // totalOpportunityCost에 따른 색상 계산

        const cost = station.totalOpportunityCost;

        const minCost = 50;

        const maxCost = 140;

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

        naver.maps.Event.addListener(marker, "click", () => {
          setSelectedStation(station);

          setIsPanelOpen(true);

          setShowTopList(false);
        });

        // 역 마커를 markersRef에 추가

        markersRef.current.push(marker);
      });

      // 회사 마커 및 도착지 마커는 별도로 관리되므로 추가 작업 필요 없음
    }
  }, [livingOpportunities, destination]);

  return (
    <PageLayout>
      <LeftPanel isOpen={isPanelOpen}>
        {showTopList && (
          <div>
            <h3>자취 기회비용이 작은 역세권 TOP10</h3>

            {topStations.map((station) => (
              <StationCard key={station.stationName}>
                <StationHeader
                  onClick={() => {
                    if (expandedStations.includes(station.stationName)) {
                      setExpandedStations(
                        expandedStations.filter(
                          (name) => name !== station.stationName
                        )
                      );
                    } else {
                      setExpandedStations([
                        ...expandedStations,

                        station.stationName,
                      ]);
                    }
                  }}
                >
                  <StationTitle>
                    {station.stationName}: {station.totalOpportunityCost}만원/월
                  </StationTitle>

                  {expandedStations.includes(station.stationName) ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </StationHeader>

                {expandedStations.includes(station.stationName) && (
                  <StationInfo>
                    <Section>
                      <SectionTitle>
                        <FaSubway /> 기본 정보
                      </SectionTitle>

                      <InfoItem>
                        <strong>역명:</strong> {station.stationName}
                      </InfoItem>

                      <InfoItem>
                        <strong>노선:</strong> {station.line}
                      </InfoItem>
                    </Section>

                    <Section>
                      <SectionTitle>
                        <FaMoneyBillWave /> 비용 정보
                      </SectionTitle>

                      <InfoItem>
                        <strong>평균 월세 비용:</strong> {station.rentCost}
                        만원/월
                      </InfoItem>

                      <InfoItem>
                        <strong>회사 통근 기회비용:</strong>{" "}
                        {station.commuteCost}만원/월
                      </InfoItem>

                      <InfoItem>
                        <strong>실제 거주 기회비용:</strong>{" "}
                        {station.totalOpportunityCost}만원/월
                      </InfoItem>
                    </Section>

                    <Section>
                      <SectionTitle>
                        <FaClock /> 통근 정보
                      </SectionTitle>

                      <InfoItem>
                        <strong>통근 시간:</strong> {station.commuteTime}
                        분/편도
                      </InfoItem>
                    </Section>

                    <Section>
                      <SectionTitle>
                        <FaThumbsUp /> 장점
                      </SectionTitle>

                      <InfoItem>{station.pros}</InfoItem>
                    </Section>

                    <Section>
                      <SectionTitle>
                        <FaThumbsDown /> 단점
                      </SectionTitle>

                      <InfoItem>{station.cons}</InfoItem>
                    </Section>
                  </StationInfo>
                )}
              </StationCard>
            ))}
          </div>
        )}

        {!showTopList && selectedStation && (
          <div>
            <button
              onClick={() => {
                setShowTopList(true);

                setSelectedStation(null);
              }}
              style={{
                marginBottom: "10px",

                background: "none",

                border: "none",

                cursor: "pointer",

                fontSize: "16px",

                color: "#007bff",

                display: "flex",

                alignItems: "center",
              }}
            >
              <FaArrowLeft style={{ marginRight: "5px" }} />
              목록 보기
            </button>

            <StationCard>
              <StationHeader>
                <StationTitle>{selectedStation.stationName}</StationTitle>
              </StationHeader>

              <StationInfo>
                <Section>
                  <SectionTitle>
                    <FaSubway /> 기본 정보
                  </SectionTitle>

                  <InfoItem>
                    <strong>역명:</strong> {selectedStation.stationName}
                  </InfoItem>

                  <InfoItem>
                    <strong>노선:</strong> {selectedStation.line}
                  </InfoItem>
                </Section>

                <Section>
                  <SectionTitle>
                    <FaMoneyBillWave /> 비용 정보
                  </SectionTitle>

                  <InfoItem>
                    <strong>평균 월세 비용:</strong> {selectedStation.rentCost}
                    만원/월
                  </InfoItem>

                  <InfoItem>
                    <strong>회사 통근 기회비용:</strong>{" "}
                    {selectedStation.commuteCost}만원/월
                  </InfoItem>

                  <InfoItem>
                    <strong>실제 거주 기회비용:</strong>{" "}
                    {selectedStation.totalOpportunityCost}만원/월
                  </InfoItem>
                </Section>

                <Section>
                  <SectionTitle>
                    <FaClock /> 통근 정보
                  </SectionTitle>

                  <InfoItem>
                    <strong>통근 시간:</strong> {selectedStation.commuteTime}
                    분/편도
                  </InfoItem>
                </Section>

                <Section>
                  <SectionTitle>
                    <FaThumbsUp /> 장점
                  </SectionTitle>

                  <InfoItem>{selectedStation.pros}</InfoItem>
                </Section>

                <Section>
                  <SectionTitle>
                    <FaThumbsDown /> 단점
                  </SectionTitle>

                  <InfoItem>{selectedStation.cons}</InfoItem>
                </Section>
              </StationInfo>
            </StationCard>
          </div>
        )}
      </LeftPanel>

      <MapContainer>
        {showInstruction && !destination && (
          <InstructionOverlay>
            <span>맵을 우클릭하여 위치를 지정할 수 있습니다.</span>

            <button
              onClick={() => setShowInstruction(false)}
              style={{
                marginLeft: "10px",

                background: "transparent",

                border: "none",

                cursor: "pointer",

                fontSize: "16px",
              }}
            >
              X
            </button>
          </InstructionOverlay>
        )}

        {showInstruction && destination && (
          <InstructionOverlay>
            <span>역 마커를 클릭하면 관련 정보를 확인할 수 있습니다.</span>

            <button
              onClick={() => setShowInstruction(false)}
              style={{
                marginLeft: "10px",

                background: "transparent",

                border: "none",

                cursor: "pointer",

                fontSize: "16px",
              }}
            >
              X
            </button>
          </InstructionOverlay>
        )}

        <div id="map" style={{ width: "100%", height: "100vh" }}></div>
      </MapContainer>
    </PageLayout>
  );
};

export default AddressMap;
