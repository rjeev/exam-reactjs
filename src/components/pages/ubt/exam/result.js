import React, { useState, useContext } from "react";
import { useSnackbar } from "notistack";
import { userContext } from "../../../../userContext";
import { useNavigate } from "react-router-dom";

const UbtResult = () => {
  const [result, setResult] = useState(0);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const userData = useContext(userContext);
  const navigate = useNavigate();

  const getResult = async (sid) => {
    const resp = await fetch(`${process.env.REACT_APP_apiUrl}api/v1/ubt/set/${sid}/result`, {
      method: "GET",
      headers: {
        'Authorization': 'Bearer '+ userData.token
    }, 
    });
    const data = await resp.json();
    if (resp.ok) {
      if (data.status) {
        setResult(data.payload.total_points);
      } else {
        enqueueSnackbar("Set detail not found", { variant: "error" });
      }
    } else {
      enqueueSnackbar("Set detail not found", { variant: "error" });
    }
  };

  const gotoQuestionSet = () => {
    navigate("/ubt/sets");
  };

  const checkSetExist = () => {
    if (
      localStorage.getItem("ubt_set_id") !== undefined &&
      localStorage.getItem("ubt_set_id") * 1 > 0
    ) {
      return localStorage.getItem("ubt_set_id");
    } else {
      return false;
    }
  };

  React.useEffect(() => {
    if (userData !== null) {
      const sid = checkSetExist();
      if (sid) {
        getResult(sid);
      } else {
        enqueueSnackbar("No question set selected", { variant: "error" });
        
      }
    }
    
  }, [userData]);

  return (
    userData && 
    <div className="container-fluid">
    <div className="row">
        <div className="col-md-12">
          <div className="welcome">
            <div className="result">
              <h6>{userData.user.name}, this is your result.</h6>
              <h2>
                You scored <span>{result}</span>
              </h2>
              <button
                className="btn btn-success mt-3"
                onClick={gotoQuestionSet}
              >
                Back to Question Set
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


UbtResult.layout = "L2";
export default UbtResult;