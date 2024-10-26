import React, { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";

// 모달의 스타일을 지정할 수 있습니다.
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: 0,
    maxWidth: "80vw",
    maxHeight: "60vh",
  },
  overlay: {
    zIndex: 10, // 모달 배경에 적용될 z-index 값
  },
};

// introduce 텍스트의 크기를 키우기 위한 스타일
const StyledPre = styled.pre`
  font-size: 18px; // 글자 크기 설정
  line-height: 1.5; // 가독성을 위해 줄 간격 조절
`;

// 모달을 앱의 루트 엘리먼트에 바인딩합니다(선택적).
Modal.setAppElement("#root");

const Button = styled.button`
  padding: 8px 16px;
  
  background-color: white;  // 배경을 흰색으로 설정
  border: 0.7px solid black;  // 검정색 테두리 추가
  border-radius: 4px;
  cursor: pointer;
  //margin-left: auto; // 오른쪽 정렬을 위해
  display: block;

  margin-right: 10px; // 모든 버튼에 오른쪽 마진 추가
  &:last-child {
    margin-right: 0; // 마지막 버튼의 오른쪽 마진 제거
  }
`;

function GuideModal() {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const introduce = `
현재 수도권 503개 지하철 역세권 범위내에 자취방 일반 기준인 주택/빌라 원룸 평균 치를 기준으로 서비스를 제공 중이며,
관련 매물이 없는 지하철 역 227곳은 미포함 되어 있으니 참고바랍니다.
투룸, 오피스텔를 기준으로 한 데이터도 추후 선택기능으로 추가할 예정입니다.
    `;

  const howTo = `

    `;

  const example = `

    `;

  return (
    <div>
      <Button onClick={openModal}>안내사항</Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="사용법 모달"
      >
        
        <StyledPre>{introduce}</StyledPre>

        <pre>{howTo}</pre>
        <pre>{example}</pre>

        
        <button onClick={closeModal}>닫기</button>
      </Modal>
    </div>
  );
}

export default GuideModal;
