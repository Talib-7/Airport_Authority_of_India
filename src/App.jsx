import LoginPage from "./modules/auth/pages/LoginPage";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
//for Registration page
import { Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./modules/auth/pages/RegisterPage";
import ForgotPasswordPage from "./modules/auth/pages/ForgotPasswordPage";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import SurveyQuestions from "./modules/surveyQuestions/SurveyQuestions";
import SurveyRunning from "./modules/surveyRunning/SurveyRunning";
import Airports from "./modules/airports/Airports";
import RegisteredAgents from "./modules/registeredAgents/RegisteredAgents"
import ApprovedAgents from "./modules/approvedAgents/ApprovedAgents"
import CreateUser from "./modules/createUser/CreateUser";
import AgentHistory from "./modules/agentHistory/AgentHistory";
import GeneralQuestions from "./modules/generalQuestions/GeneralQuestions";
import SurveyManagement from "./modules/surveyManagement/SurveyManagement";
// import CreateFeedback from "./modules/createFeedback/CreateFeedback";
import FeedbackForm from "./modules/feedbackForm/FeedbackForm";
import SurveyHistory from "./modules/surveyHistory/SurveyHistory";
import airportsService from "./modules/airports/services/airportsService";

const ADMIN_ROLE_ID = 1;
const AGENT_ROLE_ID = 2;

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (_error) {
    return null;
  }
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [locationAccessState, setLocationAccessState] = useState({
    status: "idle",
    allowed: true,
    airport: null,
    error: null,
  });
  const token = localStorage.getItem("token");
  const currentUser = getCurrentUser();
  const currentRoleId = currentUser?.roleId;

  useEffect(() => {
    if (!token || currentRoleId !== AGENT_ROLE_ID) {
      setLocationAccessState({
        status: "idle",
        allowed: true,
        airport: null,
        error: null,
      });
      return;
    }

    let cancelled = false;

    const checkAirportAccess = async (latitude, longitude) => {
      try {
        const response = await airportsService.validateAccess(latitude, longitude);

        if (cancelled) {
          return;
        }

        setLocationAccessState({
          status: "done",
          allowed: !!response.allowed,
          airport: response.airport || null,
          error: response.allowed ? null : "Your current location is outside the active airport regions.",
        });
      } catch (_error) {
        if (cancelled) {
          return;
        }

        setLocationAccessState({
          status: "done",
          allowed: false,
          airport: null,
          error: "Unable to verify airport access for your current location.",
        });
      }
    };

    if (!navigator.geolocation) {
      setLocationAccessState({
        status: "done",
        allowed: false,
        airport: null,
        error: "Location services are not available in this browser.",
      });
      return undefined;
    }

    setLocationAccessState({
      status: "checking",
      allowed: false,
      airport: null,
      error: null,
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        checkAirportAccess(position.coords.latitude, position.coords.longitude);
      },
      () => {
        if (!cancelled) {
          setLocationAccessState({
            status: "done",
            allowed: false,
            airport: null,
            error: "Location access is required to open the portal.",
          });
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );

    return () => {
      cancelled = true;
    };
  }, [token, currentRoleId]);

  const renderProtectedRoute = (element, allowedRoles = [ADMIN_ROLE_ID]) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    if (!currentRoleId || !allowedRoles.includes(currentRoleId)) {
      return <Navigate to="/dashboard" replace />;
    }

    if (currentRoleId === AGENT_ROLE_ID) {
      if (locationAccessState.status !== "done") {
        return (
          <div className="portal-access-state">
            <div className="portal-access-card">
              <span className="portal-access-eyebrow">Checking access</span>
              <h2>Verifying airport geofence</h2>
              <p>We are checking whether your current location is within an approved airport region.</p>
            </div>
          </div>
        );
      }

      if (!locationAccessState.allowed) {
        return (
          <div className="portal-access-state">
            <div className="portal-access-card blocked">
              <span className="portal-access-eyebrow">Access blocked</span>
              <h2>Portal unavailable from this location</h2>
              <p>{locationAccessState.error || "You must be within the region of an airport to continue."}</p>
              <button
                className="portal-access-retry"
                onClick={() => window.location.reload()}
              >
                Retry location check
              </button>
            </div>
    
          </div>
        );
      }
    }

    return element;
  };
  
  useEffect(() => {
    // Public routes that don't need authentication
    const publicRoutes = ["/", "/login", "/register", "/forgot"];
    const isPublicRoute = publicRoutes.includes(location.pathname);
    
    if (!token && !isPublicRoute) {
      navigate("/");
    }
  }, [navigate, location.pathname]);
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage/>}/>
        <Route path="/dashboard" element={renderProtectedRoute(<Dashboard />, [ADMIN_ROLE_ID, AGENT_ROLE_ID])} />
        <Route path="/survey-questions" element={renderProtectedRoute(<SurveyQuestions />)} />
        <Route path="/survey-running" element={renderProtectedRoute(<SurveyRunning />, [ADMIN_ROLE_ID, AGENT_ROLE_ID])} />
        <Route path="/airports" element={renderProtectedRoute(<Airports />)} />
        <Route path="/registered-agents" element={renderProtectedRoute(<RegisteredAgents />)} />
        <Route path="/approved-agents" element={renderProtectedRoute(<ApprovedAgents />)} />
        <Route path="/create-user" element={renderProtectedRoute(<CreateUser />)} />  
        <Route path="/agent-history" element={renderProtectedRoute(<AgentHistory />)} />
        <Route path="/general-questions" element={renderProtectedRoute(<GeneralQuestions />)} />  
        <Route path="/survey-management" element={renderProtectedRoute(<SurveyManagement />)} />
        {/* <Route path="/create-feedback" element={<CreateFeedback />} /> */}
        <Route path="/feedback-form/:surveyId" element={<FeedbackForm />} />
        <Route path="/feedback-form" element={<FeedbackForm />} />
        <Route path="/survey-history" element={renderProtectedRoute(<SurveyHistory />)} />
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      </Routes>

    </>
  );
}

export default App;
