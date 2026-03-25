import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Board from "./pages/Board";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;