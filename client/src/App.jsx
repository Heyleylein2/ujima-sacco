import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LoanApplication from "./pages/LoanApplication";
import OfficerDashboard from "./pages/OfficerDashboard";
import BiasAudit from "./pages/BiasAudit";

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ backgroundColor: "var(--ujima-light)" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<LoanApplication />} />
          <Route path="/officer" element={<OfficerDashboard />} />
          <Route path="/audit" element={<BiasAudit />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;