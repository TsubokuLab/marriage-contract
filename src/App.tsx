import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ContractProvider } from "./state/ContractContext";
import { ToastContainer } from "./components/ui/Toast";
import { Landing } from "./routes/Landing";
import { Wizard } from "./routes/Wizard";
import { Preview } from "./routes/Preview";

export default function App() {
  return (
    <ContractProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
      <ToastContainer />
    </ContractProvider>
  );
}
