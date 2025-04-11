import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import OnboardingPage from "./pages/OnboardingPage/OnboardingPage";
import HomePage from "./pages/HomePage/HomePage";
import AddVehiclePage from "./pages/AddVehiclePage/AddVehiclePage";
import PrivateRoute from "./components/PrivateRoute";
import "./App.scss";
import AuthPage from "./pages/AuthPage/AuthPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Онбординг — доступен всегда */}
        <Route path="/onboarding/:step" element={<OnboardingPage />} />

        {/* Авторизация / Регистрация */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Защищённые маршруты */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-car"
          element={
            <PrivateRoute>
              <AddVehiclePage />
            </PrivateRoute>
          }
        />

        {/* Редирект по умолчанию */}
        <Route path="*" element={<Navigate to="/onboarding" />} />
      </Routes>
    </Router>
  );
}

export default App;
