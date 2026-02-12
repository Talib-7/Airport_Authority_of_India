import LoginPage from "./modules/auth/pages/LoginPage";

//for Registration page
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./modules/auth/pages/RegisterPage";
import ForgotPasswordPage from "./modules/auth/pages/ForgotPasswordPage";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import GeneralQuestions from "./modules/generalQuestions/GeneralQuestions";

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot" element={<ForgotPasswordPage/>}/>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/general-questions" element={<GeneralQuestions />}/>
    
    </Routes>

  );
}

export default App;
