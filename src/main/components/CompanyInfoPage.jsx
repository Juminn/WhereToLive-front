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

  useEffect(() => {
    if (location.state?.detail) {
      setData(location.state.detail);
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
      <h1>지하철역별 자취 기회비용</h1>
      <Table>
        <thead>
          <tr>
            <Th onClick={() => sortData("montlyTotalOpportunity")}>
              총 비용/월 {getSortIndicator("montlyTotalOpportunity")}
            </Th>
            <Th onClick={() => sortData("name")}>
              지하철 역명 {getSortIndicator("name")}
            </Th>
            <Th onClick={() => sortData("montlyRent")}>
              월세비용/월 {getSortIndicator("montlyRent")}
            </Th>
            <Th onClick={() => sortData("montlyGoingOpportunity")}>
              출퇴근 시간 기회비용/월{" "}
              {getSortIndicator("montlyGoingOpportunity")}
            </Th>
            <Th onClick={() => sortData("goingWorkMinute")}>
              출퇴근 시간 {getSortIndicator("goingWorkMinute")}
            </Th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <Tr key={item.id}>
              <Td>{item.montlyTotalOpportunity}만원</Td>
              <Td>{item.name}</Td>
              <Td>{item.montlyRent}만원</Td>
              <Td>{item.montlyGoingOpportunity}만원</Td>
              <Td>{item.goingWorkMinute || "N/A"}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CompanyInfoPage;
