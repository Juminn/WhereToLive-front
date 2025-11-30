import React from 'react';
import styled from 'styled-components';
import {
  FaSubway,
  FaMoneyBillWave,
  FaClock,
  FaThumbsUp,
  FaThumbsDown,
} from 'react-icons/fa';

const InfoWrapper = styled.div`
  padding: 15px;
  background: #fafafa;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
  & > svg {
    margin-right: 8px;
    color: #007bff;
  }
`;

function InfoItem({ label, value }) {
  return (
    <p>
      <strong>{label}:</strong> {value}
    </p>
  );
}

function InfoSection({ icon, title, children }) {
  return (
    <Section>
      <SectionTitle>
        {icon}
        {title}
      </SectionTitle>
      {children}
    </Section>
  );
}

export default function StationInfo({ station }) {
  return (
    <InfoWrapper>
      <InfoSection icon={<FaSubway />} title="기본 정보">
        <InfoItem label="역명" value={station.stationName} />
        <InfoItem label="노선" value={station.line} />
      </InfoSection>
      <InfoSection icon={<FaMoneyBillWave />} title="비용 정보">
        <InfoItem label="평균 월세 비용" value={`${station.rentCost}만원/월`} />
        <InfoItem label="회사 통근 기회비용" value={`${station.commuteCost}만원/월`} />
        <InfoItem label="실제 거주 기회비용" value={`${station.totalOpportunityCost}만원/월`} />
      </InfoSection>
      <InfoSection icon={<FaClock />} title="통근 정보">
        <InfoItem label="통근 시간" value={`${station.commuteTime}분/편도`} />
      </InfoSection>
      <InfoSection icon={<FaThumbsUp />} title="장점">
        <p>{station.pros}</p>
      </InfoSection>
      <InfoSection icon={<FaThumbsDown />} title="단점">
        <p>{station.cons}</p>
      </InfoSection>
    </InfoWrapper>
  );
}
