import { useState, useCallback } from 'react';

export default function Test() {
  const [keyword, setKeyword] = useState('');
  const [places, setPlaces]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const search = useCallback(q => {
    const kw = q.trim();
    if (!kw) return;

    if (!window.kakao?.maps?.services) {
      setError('Kakao SDK 로드 전입니다.');
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    setLoading(true);
    ps.keywordSearch(kw, (data, status) => {
      setLoading(false);

      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(data);
        setError(null);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        setPlaces([]);
        setError('검색 결과가 없습니다.');
      } else {
        setPlaces([]);
        setError('검색 중 오류가 발생했습니다.');
      }
    });
  }, []);

  const handleSearch = () => search(keyword);

  return (
    <div style={{ padding: 16 }}>
      <input
        value={keyword}
        placeholder="검색어를 입력하세요"
        onChange={e => setKeyword(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch}>검색</button>

      {loading && <p>로딩 중…</p>}
      {error && <p>{error}</p>}

      <ul style={{ marginTop: 12 }}>
        {places.map(p => (
          <li key={p.id}>
            <strong>{p.place_name}</strong>
            {p.road_address_name && ` – ${p.road_address_name}`}
            {p.phone && ` (${p.phone})`}
          </li>
        ))}
      </ul>
    </div>
  );
}
