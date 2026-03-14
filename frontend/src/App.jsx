import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BenchDetailPage from "./pages/BenchDetailPage";
import AddBenchPage from "./pages/AddBenchPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bench/:id" element={<BenchDetailPage />} />
        <Route path="/add-bench" element={<AddBenchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
