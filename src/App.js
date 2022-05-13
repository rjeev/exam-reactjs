import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Login from './Login';
import ChooseTest from './components/pages/choosetest';
import LoginLayout from './components/loginlayout';
import Layout from './components/layout';
import UbtSets from './components/pages/ubt/sets';
import CbtSets from './components/pages/cbt/sets';
import CbtStart from './components/pages/cbt/start';
import UbtStart from './components/pages/ubt/start';
import Notfound from './components/pages/404';
import Profile from './components/pages/profile';
import "./styles/bootstrap.min.css";
import './styles/style.css'
import './styles/player.css'
import './styles/font-awesome/css/font-awesome.min.css';
import { SnackbarProvider } from 'notistack';
import {userContext} from './userContext';
import CbtDashboard from './components/pages/cbt/exam/dashboard';
import UbtDashboard from './components/pages/ubt/exam/dashboard';
import CbtReading from './components/pages/cbt/exam/reading';
import UbtReading from './components/pages/ubt/exam/reading';
import CbtListening from './components/pages/cbt/exam/listening';
import UbtListening from './components/pages/ubt/exam/listening';
import CbtResult from './components/pages/cbt/exam/result';
import UbtResult from './components/pages/ubt/exam/result';
import Purchase from './components/pages/purchase';
import Register from './components/pages/signup';
import Logout from './components/pages/logout';

function RequireAuth({ children }) {

  let location = useLocation();
  let navigate = useNavigate();
  let cookieName = localStorage.getItem(`${process.env.REACT_APP_COOKIE_NAME}`);
  if (!cookieName) {
    return <Navigate to="/" state={{ from: location }} replace />;
  } else if (location.pathname === '/signup') {
    navigate('/signup');
  } 

  return children;
}



function App() {
  const [userData, setUserData] = useState(null)
  const [isAuthenticated, setIsAutenticated] = useState(false)
  let uData = null;


  const loadUserFromCookies = async () => {
    let cookieName = localStorage.getItem(`${process.env.REACT_APP_COOKIE_NAME}`);
    if (cookieName) {
      let UserData = JSON.parse(cookieName);
      setUserData(UserData);
      uData = UserData;
      setIsAutenticated(true);
    }
  }

  useEffect(() => {
    (async function () {
      await loadUserFromCookies();
    })();
  }, []);

  return (

    <div className="App">
      <userContext.Provider value={userData}>
      <SnackbarProvider maxSnack={3}>
        {
          userData?
          <Layout>
          <BrowserRouter>

            <Routes>
              <Route path="/login" element={<Login />} />
              {
                userData?
                <>
                <Route path="/choosetest" element={<RequireAuth><ChooseTest/>  </RequireAuth>} />
                <Route path="/ubt/sets" element={<RequireAuth><UbtSets/></RequireAuth>} />
                <Route path="/cbt/sets" element={<RequireAuth><CbtSets/></RequireAuth>} />
                <Route path="/cbt/start/:id" element={<RequireAuth><CbtStart/></RequireAuth>} />
                <Route path="/ubt/start/:id" element={<RequireAuth><UbtStart/></RequireAuth>} />


                <Route path="/cbt/exam/dashboard" element={<RequireAuth><CbtDashboard/></RequireAuth>} />
                <Route path="/ubt/exam/dashboard" element={<RequireAuth><UbtDashboard/></RequireAuth>} />
                <Route path="/cbt/exam/reading" element={<RequireAuth><CbtReading/></RequireAuth>} />
                <Route path="/ubt/exam/reading" element={<RequireAuth><UbtReading/></RequireAuth>} />
                <Route path="/cbt/exam/listening" element={<RequireAuth><CbtListening/></RequireAuth>} />
                <Route path="/ubt/exam/listening" element={<RequireAuth><UbtListening/></RequireAuth>} />
                <Route path="/cbt/exam/result" element={<RequireAuth><CbtResult/></RequireAuth>} />
                <Route path="/ubt/exam/result" element={<RequireAuth><UbtResult/></RequireAuth>} />
                <Route path="/profile" element={<RequireAuth><Profile/></RequireAuth>} />
                <Route path="/purchase" element={<RequireAuth><Purchase/></RequireAuth>} />
                <Route path="/logout" element={<RequireAuth><Logout/></RequireAuth>} />
                </>:''
              }
              
              <Route path="*" element={<Notfound/>} />
            </Routes>

          </BrowserRouter>
        </Layout>:
        <LoginLayout>
        <BrowserRouter>

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="*" element={<Notfound/>} />
          </Routes>

        </BrowserRouter>
      </LoginLayout>
        }
        
        
      </SnackbarProvider>
      </userContext.Provider>
    </div>
  );
}

export default App;


