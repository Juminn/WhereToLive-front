import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [selectedCompany, setSelectedCompany] = useState("");
  const navigate = useNavigate();

  const companies = ["Apple", "현대오토에버", "카카오모빌리티", "숭실대학교" ,"Microsoft", "Amazon", "Facebook"];

  const handleSelection = async (event) => {
    const company = event.target.value;
    const apiUrl = process.env.REACT_APP_API_ENDPOINT;
    const response = await fetch(`${apiUrl}/opportunity?companyName=${company}`);
    const data = await response.json();
    navigate("/company-info", { state: { detail: data, selectedCompany: company } });
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1 style={{ marginBottom: "50px", fontSize: "45px" }}>
        어디서 자취할까?
      </h1>
      <select
        value={selectedCompany}
        onChange={handleSelection}
        style={{
          width: "550px",
          height: "40px",
          fontSize: "16px",
          borderRadius: "15px", // Slightly rounded corners, more square-like
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
    </div>
  );
};

export default SearchPage;
