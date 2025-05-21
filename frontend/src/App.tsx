import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import OnboardingPage from "./pages/OnboardingPage/OnboardingPage";
import HomePage from "./pages/HomePage/HomePage";
import CarFormPage from "./pages/CarFormPage/CarFormPage";
import PrivateRoute from "./components/PrivateRoute";
import "./App.scss";
import AuthPage from "./pages/AuthPage/AuthPage";
import CarPage from "./pages/CarPage/CarPage";
import MaintenanceFormPage from "./pages/MaintenanceFormPage/MaintenanceFormPage";

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
              <CarFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-car"
          element={
            <PrivateRoute>
              <CarFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-car/:vin"
          element={
            <PrivateRoute>
              <CarFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/car/:vin"
          element={
            <PrivateRoute>
              <CarPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/car/:vin/add-maintenance"
          element={
            <PrivateRoute>
              <MaintenanceFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/car/:vin/edit-maintenance/:id"
          element={
            <PrivateRoute>
              <MaintenanceFormPage />
            </PrivateRoute>
          }
        />

        {/* Редирект по умолчанию */}
        <Route path="*" element={<Navigate to="/onboarding/1" />} />
      </Routes>
    </Router>
  );
}

export default App;
