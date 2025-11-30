import React from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Card = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 10px;
  background: #fff;
`;

const CardHeader = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #333;
`;

function StationCard({ station, expanded, onToggle, onSelect }) {
  const handleClick = () => {
    onToggle(station.stationName);
    onSelect?.(station);
  };

  return (
    <Card>
      <CardHeader onClick={handleClick}>
        <CardTitle>
          {station.stationName}: {station.totalOpportunityCost}만원/월
        </CardTitle>
        {expanded ? <FaChevronUp /> : <FaChevronDown />}
      </CardHeader>
    </Card>
  );
}

export default React.memo(StationCard);
