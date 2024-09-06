import "./App.css";
import SearchPage from "./main/components/SearchPage";
import CompanyInfoPage from "./main/components/CompanyInfoPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/company-info" element={<CompanyInfoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
