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

  const [selectedCompany, setSelectedCompany] = useState("");

  const handleCompanySelection = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleWorkingDaysSelection = async (event) => {
    const workDays = event.target.value;
    const apiUrl = process.env.REACT_APP_API_ENDPOINT;
    const response = await fetch(
      `${apiUrl}/opportunity?company=${selectedCompany}&workdays=${workDays}`
    );
    const data = await response.json();
    navigate("/company-info", {
      state: { detail: data, selectedCompany: selectedCompany, selectedWorkingDays: workDays },
    });
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1 style={{ marginBottom: "50px", fontSize: "45px" }}>
        어디서 자취할까?
      </h1>
      <select
        onChange={handleCompanySelection}
        style={{
          width: "550px",
          height: "40px",
          fontSize: "16px",
          borderRadius: "15px",
          padding: "5px 10px",
        }}
      >
        <option value="">회사를 선택하세요</option>
        {companies.map((company) => (
          <option key={company} value={company}>
            {company}
          </option>
        ))}
      </select>

      {selectedCompany && (
        <div style={{ marginTop: "20px" }}>
          <select
            onChange={handleWorkingDaysSelection}
            style={{
              width: "550px",
              height: "40px",
              fontSize: "16px",
              borderRadius: "15px",
              padding: "5px 10px",
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
