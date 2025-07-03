// ============================================
// src/components/LocationSearch.jsx  (FIXED)
// ============================================

/*
  LocationSearch.jsx
  - Kakao Places keywordSearch
  - 결과 리스트 클릭 → 부모(onSelect)에게 장소 객체 전달
*/

import React, { useCallback, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  flex: 1;
  height: 42px;
  font-size: 16px;
  padding: 0 10px;
  border: 1px solid #aaa;
  border-radius: 6px;
`;

const SearchBtn = styled.button`
  width: 80px;
  border: none;
  background: #0077cc;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #1890ff;
  }
`;

const ResultList = styled.ul`
  width: 100%;
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 6px 10px;
  border-radius: 6px;
`;

const Item = styled.li`
  padding: 8px 4px;
  cursor: pointer;

  &:hover {
    background: #f0f8ff;
  }
`;

export default function LocationSearch({ onSelect = () => {} }) {
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [info, setInfo] = useState({ loading: false, error: null });

  /* Kakao keyword search */
  const search = useCallback((q) => {
    const kw = q.trim();
    if (!kw) return;

    if (!window.kakao?.maps?.services) {
      setInfo({ loading: false, error: "Kakao SDK 로드 전입니다." });
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    setInfo({ loading: true, error: null });

    ps.keywordSearch(kw, (data, status) => {
      setInfo({ loading: false, error: null });

      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(data);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        setPlaces([]);
        setInfo({ loading: false, error: "검색 결과가 없습니다." });
      } else {
        setPlaces([]);
        setInfo({ loading: false, error: "검색 중 오류가 발생했습니다." });
      }
    });
  }, []);

  const handleSearch = () => search(keyword);

  /* 리스트 클릭 시 부모에게 전달 */
  const handleSelect = (p) => {
    if (typeof onSelect === "function") onSelect(p);
    else console.warn("LocationSearch: onSelect prop 이 함수가 아닙니다.");
  };

  return (
    <div style={{ width: 460 }}>
      <InputRow>
        <SearchInput
          value={keyword}
          placeholder="회사·학교·건물 이름 입력"
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <SearchBtn onClick={handleSearch}>검색</SearchBtn>
      </InputRow>

      {info.loading && <p>로딩 중…</p>}
      {info.error && <p>{info.error}</p>}

      <ResultList>
        {places.map((p) => (
          <Item key={p.id} onClick={() => handleSelect(p)}>
            <strong>{p.place_name}</strong>
            {p.road_address_name && ` – ${p.road_address_name}`}
            {p.phone && ` (${p.phone})`}
          </Item>
        ))}
      </ResultList>
    </div>
  );
}

LocationSearch.propTypes = {
  onSelect: PropTypes.func,
};

// =============================
// ===============
//  변경 사항 핵심
// --------------------------------------------
// 1. prop 이름을 onPlaceSelect → onSelect 로 통일
// 2. SearchPage.jsx 에서 <LocationSearch onSelect={handlePlaceSelect} /> 로 전달
// 3. LocationSearch 클릭 시 handleSelect 내부에서 typeof 검사로 방어
// 4. PropTypes & defaultProps 추가해 개발 단계에서 누락 경고
// ============================================
