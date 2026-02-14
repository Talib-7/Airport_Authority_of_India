import LoginPage from "./modules/auth/pages/LoginPage";

//for Registration page
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./modules/auth/pages/RegisterPage";
import ForgotPasswordPage from "./modules/auth/pages/ForgotPasswordPage";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import SurveyQuestions from "./modules/surveyQuestions/SurveyQuestions";
import SurveyRunning from "./modules/surveyRunning/SurveyRunning";
import Airports from "./modules/airports/Airports";

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot" element={<ForgotPasswordPage/>}/>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/survey-questions" element={<SurveyQuestions />} />
      <Route path="/survey-running" element={<SurveyRunning />} />
      <Route path="/airports" element={<Airports />} />
    
    </Routes>

  );
}

export default App;
