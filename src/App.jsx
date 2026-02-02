import LoginPage from "./modules/auth/pages/LoginPage";

//for Registration page
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./modules/auth/pages/RegisterPage";

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>

  );
}

export default App;
