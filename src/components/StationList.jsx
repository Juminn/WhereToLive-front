import React, { useState } from 'react';
import styled from 'styled-components';
import StationCard from './StationCard';
import StationInfo from './StationInfo';

const Wrapper = styled.div`
  padding-bottom: 20px;
`;

export default function StationList({ stations, onSelect }) {
  const [expanded, setExpanded] = useState([]);

  const toggle = (name) =>
    setExpanded((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );

  return (
    <Wrapper>
      <h3>자취 기회비용이 작은 역세권 TOP10</h3>
      {stations.map((s) => (
        <div key={s.stationName}>
          <StationCard
            station={s}
            expanded={expanded.includes(s.stationName)}
            onToggle={toggle}
            onSelect={onSelect}
          />
          {expanded.includes(s.stationName) && <StationInfo station={s} />}
        </div>
      ))}
    </Wrapper>
  );
}
