import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const navigate = useNavigate();

  const companies = [
    "네이버",
    "카카오모빌리티",
    "라인플러스",
    "쿠팡",
    "배달의민족",
    "숭실대학교",
    "서울대학교",
    "연세대학교",
    "고려대학교",
  ];

  const [selectionType, setSelectionType] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState("");

  const handleCompanySelection = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleWorkingDaysSelection = async (event) => {
    const workDays = event.target.value;
    const apiUrl = process.env.REACT_APP_API_ENDPOINT;

    if (selectionType === "company" && selectedCompany) {
      const response = await fetch(
        `${apiUrl}/opportunity2?company=${selectedCompany}&workdays=${workDays}`
      );
      const data = await response.json();

      navigate("/addressMap", {
        state: {
          detail: data,
          selectedCompany: selectedCompany,
          selectedWorkingDays: workDays,
        },
      });
    } else if (selectionType === "location") {
      navigate("/addressMap", {
        state: { selectedWorkingDays: workDays },
      });
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "50px",
        fontFamily: "'Noto Sans KR', sans-serif",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "50px", fontSize: "45px", color: "#333" }}>
        어디서 자취할까?
      </h1>

      {!selectionType && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <button
            onClick={() => setSelectionType("company")}
            style={{
              width: "250px",
              height: "80px",
              fontSize: "20px",
              borderRadius: "15px",
              backgroundColor: "#ffffff",
              color: "#333",
              border: "2px solid #ccc",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#e6f7ff";
              e.target.style.borderColor = "#91d5ff";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.borderColor = "#ccc";
            }}
          >
            회사 선택하기
          </button>
          <button
            onClick={() => setSelectionType("location")}
            style={{
              width: "250px",
              height: "80px",
              fontSize: "20px",
              borderRadius: "15px",
              backgroundColor: "#ffffff",
              color: "#333",
              border: "2px solid #ccc",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#e6f7ff";
              e.target.style.borderColor = "#91d5ff";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.borderColor = "#ccc";
            }}
          >
            지도에서 위치 지정하기
          </button>
        </div>
      )}

      {selectionType === "company" && (
        <div style={{ marginTop: "20px" }}>
          <select
            onChange={handleCompanySelection}
            style={{
              width: "550px",
              height: "50px",
              fontSize: "18px",
              borderRadius: "10px",
              padding: "5px 10px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              color: "#333",
            }}
          >
            <option value="">회사를 선택하세요</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>
      )}

      {((selectionType === "company" && selectedCompany) ||
        selectionType === "location") && (
        <div style={{ marginTop: "20px" }}>
          <select
            onChange={handleWorkingDaysSelection}
            style={{
              width: "550px",
              height: "50px",
              fontSize: "18px",
              borderRadius: "10px",
              padding: "5px 10px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              color: "#333",
            }}
          >
            <option value="">근무일수 또는 수업일수를 선택해주세요</option>
            {[...Array(8).keys()].map((day) => (
              <option key={day} value={day}>
                {day}일
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
