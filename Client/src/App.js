import { Container, Row } from 'reactstrap';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Feed from "./Components/Feed";
import AdminAddEvent from "./Components/AdminAddEvent";
import AdminViewFeedback from "./Components/AdminViewFeedback";
import AdminLogin from "./Components/AdminLogin";
import Footer from './Components/Footer';
import EventFeedback from './Components/EventFeedback';
import Header from './Components/Header';
import { useState } from 'react';
// Admin route guard
function RequireAdmin({ children }) {
  const location = useLocation();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

const App = () => {
  const user = useSelector((state) => state.users.user);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
  
      <Router>
        <Header onAdminClick={() => setShowAdminLogin(true)} />
        <Container fluid>
          {/* <Row>
            {user ? <Header /> : null}
          </Row> */}

          <Row className="App">
            <Routes>
              {/* Welcome route - always shown first */}
              <Route path="/" element={<Feed />} />
              <Route path="/admin/add-event" element={<RequireAdmin><AdminAddEvent /></RequireAdmin>} />
              <Route path="/admin/feedback" element={<RequireAdmin><AdminViewFeedback /></RequireAdmin>} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/event-feedback" element={<EventFeedback />} />

              {/* Admin routes */}
            

              {/* Course routes */}
             
             
            </Routes>
          </Row>
          <Row>
             <Footer /> 
          </Row> 
        </Container>
      </Router>
   
  );
};

export default App;
