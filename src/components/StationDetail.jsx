import React from 'react';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';

import StationInfo from './StationInfo';

const BackButton = styled.button`
  margin-bottom: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #007bff;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Card = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
`;

const CardHeader = styled.div`
  padding: 15px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 20px;
`;

export default function StationDetail({ station, onBack }) {
  return (
    <div>
      <BackButton onClick={onBack}>
        <FaArrowLeft /> 목록 보기
      </BackButton>
      <Card>
        <CardHeader>
          <CardTitle>{station.stationName}</CardTitle>
        </CardHeader>
        <StationInfo station={station} />
      </Card>
    </div>
  );
}
