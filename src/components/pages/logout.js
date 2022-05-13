import React from 'react';
import { useNavigate } from 'react-router';
const Logout = (userData) => {

  const navigate = useNavigate();
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(process.env.REACT_APP_COOKIE_NAME);
     
    }
    navigate(`/login`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

      return (
          <div/>
      )
 
}

export default Logout;
