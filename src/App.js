import "./App.css";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import SearchPage from "./pages/SearchPage";
import AddressMap from "./pages/AddressMap";
import Test from "./pages/Test";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Navigate to="/search" replace />} />
        <Route path="/search"      element={<SearchPage />} />
        <Route path="/addressMap"  element={<AddressMap />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<h2>404 | 존재하지 않는 경로입니다.</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
