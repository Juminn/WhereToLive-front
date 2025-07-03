import { useEffect, useRef } from 'react';

/**
 * 초기 지도 생성 & 우클릭 이벤트 연결 전용 훅
 * @param {object} naver  window.naver
 * @param {function} onRightClick  지도 우클릭 콜백 (coord) => void
 * @param {object} initialCenter  {lat, lng}
 * @returns {React.MutableRefObject}
 */
export default function useNaverMap(naver, onRightClick, initialCenter) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!naver || mapRef.current) return;

    mapRef.current = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
      zoom: 10,
    });

    if (onRightClick) {
      naver.maps.Event.addListener(mapRef.current, 'rightclick', (e) => {
        onRightClick(e.coord);
      });
    }
  }, [naver, onRightClick, initialCenter]);

  return mapRef;
}
