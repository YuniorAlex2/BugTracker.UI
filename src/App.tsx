import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
   <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
        } />
    <Route path="/login" element={<LoginPage />} />
   </Routes>
  );
}

export default App;