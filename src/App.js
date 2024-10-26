import "./App.css";
import SearchPage from "./main/components/SearchPage";
import CompanyInfoPage from "./main/components/CompanyInfoPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddressMap from "./main/components/AddressMap";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<SearchPage />} />
        <Route path="/company-info" element={<CompanyInfoPage />} />
        <Route path="/" element={<AddressMap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
