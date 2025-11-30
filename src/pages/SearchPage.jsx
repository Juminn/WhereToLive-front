// ============================================
// src/pages/SearchPage.jsx  (FIXED VERSION)
// ============================================

/*
  SearchPage.jsx
  - Step 0 : 근무(수업)일수 선택
  - Step 1 : 장소(키워드) 검색 → 클릭 시 API 호출, 결과 페이지 이동

  필요 모듈 : react-router-dom v6, styled-components
  환경 변수 : REACT_APP_API_ENDPOINT  (ex. https://api.example.com)
*/

import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LocationSearch from "../components/LocationSearch";

/*****************
 *   CONSTANTS   *
 *****************/
const WORK_DAYS = [...Array(8).keys()]; // 0‥7

/*****************
 *   STYLED UI   *
 *****************/
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  min-height: 100vh;
  background: #f9f9f9;
  font-family: "Noto Sans KR", sans-serif;
`;

const Heading = styled.h1`
  font-size: 42px;
  margin-bottom: 40px;
  color: #222;
`;

const SelectBox = styled.select`
  width: 460px;
  height: 52px;
  font-size: 18px;
  border-radius: 10px;
  padding: 6px 12px;
  border: 1px solid #bbb;
  background: #fff;
  color: #333;
`;

const Loading = styled.p`
  margin-top: 30px;
  font-size: 18px;
  color: #0077cc;
`;

/*****************
 *  MAIN VIEW    *
 *****************/
export default function SearchPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: days, 1: location
  const [workDays, setDays] = useState("");
  const [loading, setLoad] = useState(false);

  /* 근무일 선택 → 장소 검색 단계로 */
  const handleWorkDays = (e) => {
    const d = e.target.value;
    if (!d) return;
    setDays(d);
    setStep(1);
  };

  /* 장소가 결정되면 위·경도로 API 호출 후 /addressMap 이동 */
  const handlePlaceSelect = useCallback(
    async (place) => {
      // Kakao 검색 결과 좌표계: x = longitude, y = latitude
      const { y: latitude, x: longitude, place_name } = place;
      const apiUrl = process.env.REACT_APP_API_ENDPOINT;

      try {
        setLoad(true);

        const resp = await fetch(
          `${apiUrl}/opportunity?latitude=${latitude}&longitude=${longitude}&workdays=${workDays}`
        );
        if (!resp.ok) throw new Error("서버 오류");

        const detail = await resp.json();

        navigate("/addressMap", {
          state: {
            detail,
            selectedPlace: place_name,
            selectedWorkingDays: workDays,
          },
        });
      } catch (err) {
        console.error(err);
        alert("기회비용 계산 중 문제가 발생했습니다.");
      } finally {
        setLoad(false);
      }
    },
    [workDays, navigate]
  );

  /* ---------- RENDER ---------- */
  return (
    <PageWrapper>
      <Heading>어디서 자취할까?</Heading>

      {/* STEP 0 – 근무일수 선택 */}
      {step === 0 && (
        <SelectBox defaultValue="" onChange={handleWorkDays}>
          <option value="">근무일수/수업일수를 선택하세요</option>
          {WORK_DAYS.map((d) => (
            <option key={d} value={d}>
              {d}일
            </option>
          ))}
        </SelectBox>
      )}

      {/* STEP 1 – 장소 검색 & 선택 */}
      {step === 1 && (
        <>
          <LocationSearch onSelect={handlePlaceSelect} />
          {loading && <Loading>기회비용 계산 중…</Loading>}
        </>
      )}
    </PageWrapper>
  );
}