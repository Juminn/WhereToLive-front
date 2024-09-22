import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: #f2f2f2;
  cursor: pointer;
  padding: 8px;
  text-align: left;
  position: relative;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const Td = styled.td`
  border-bottom: 1px solid #ddd;
  padding: 8px;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #f1f1f1;
  }
`;

const CompanyInfoPage = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState("");

  useEffect(() => {
    if (location.state?.detail) {
      setData(location.state.detail);
    }
    if (location.state?.selectedCompany) {
      setSelectedCompany(location.state.selectedCompany);
    }
  }, [location]);

  const sortData = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setData(
      [...data].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === "ascending" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === "ascending" ? 1 : -1;
        }
        return 0;
      })
    );
  };

  const getSortIndicator = (key) => {
    if (!sortConfig) return "";
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "";
  };

  return (
    <div>
      <Link to="/">돌아가기</Link>
      <h1>{selectedCompany} 기준, 역세권별 자취 기회비용</h1>
      <Table>
        <thead>
          <tr>
            <Th onClick={() => sortData("totalOpportunityCost")}>
              총 비용/월 {getSortIndicator("totalOpportunityCost")}
            </Th>
            <Th onClick={() => sortData("stationName")}>
              지하철 역명 {getSortIndicator("stationName")}
            </Th>
            <Th onClick={() => sortData("rentCost")}>
              월세비용/월 {getSortIndicator("rentCost")}
            </Th>
            <Th onClick={() => sortData("commuteCost")}>
              출퇴근 시간 기회비용/월{" "}
              {getSortIndicator("commuteCost")}
            </Th>
            <Th onClick={() => sortData("commuteTime")}>
              출퇴근 시간/일 {getSortIndicator("commuteTime")}
            </Th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <Tr key={item.stationID}>
              <Td>{item.totalOpportunityCost}만원</Td>
              <Td>{item.stationName}</Td>
              <Td>{item.rentCost}만원</Td>
              <Td>{item.commuteCost}만원</Td>
              <Td>{item.commuteTime + "분" || "N/A"}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CompanyInfoPage;
