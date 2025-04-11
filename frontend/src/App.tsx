import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import OnboardingPage from "./pages/OnboardingPage/OnboardingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import HomePage from "./pages/HomePage/HomePage";
import AddVehiclePage from "./pages/AddVehiclePage/AddVehiclePage";
import "./App.scss";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Онбординг — доступен всегда */}
        <Route path="/onboarding/:step" element={<OnboardingPage />} />

        {/* Авторизация / Регистрация */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Защищённые маршруты */}
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-car"
          element={
            isAuthenticated ? <AddVehiclePage /> : <Navigate to="/login" />
          }
        />

        {/* Редирект на онбординг по умолчанию */}
        <Route path="*" element={<Navigate to="/onboarding" />} />
      </Routes>
    </Router>
  );
}

export default App;
