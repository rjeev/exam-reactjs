import React, { useContext, useState } from "react";
import { useSnackbar } from "notistack";
import Skeleton from '@mui/material/Skeleton';
import { userContext } from "../../../userContext";
import { useNavigate, useLocation, userSearchParams } from "react-router";
import { useSearchParams, useParams } from "react-router-dom";

const CbtStart = () => {
  const [setDetail, setSetDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const {id} = useParams();
  const userData = useContext(userContext)

  const getSetDetail = async () => {
    setLoading(true);
    const resp = await fetch(`${process.env.REACT_APP_apiUrl}api/v1/cbt/${id}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userData.token,
      },
    });
    const data = await resp.json();
    if (resp.ok) {
      if (data.status) {
        setSetDetail(data.payload);
      } else {
        enqueueSnackbar("Set detail not found", { variant: "error" });
      }
    } else {
      enqueueSnackbar("Set detail not found", { variant: "error" });
    }
    setLoading(false);
  };

  const startExam = () => {
    localStorage.setItem("cbt_set_id", setDetail.id);
    localStorage.setItem("start_time", Date.now());
    navigate("/cbt/exam/dashboard");
  };

  React.useEffect(() => {
    if (userData !== null && id) {
        
      getSetDetail();
    }
  }, [userData]);

  return (
    userData && (
      <div>
        <div className="welcome">
          <h1 className="examinee-title">{`Examinee's information`}</h1>
          <div className="examinee-body">
            <div className="sub-title">
              <h2>{setDetail.set_name}</h2>
              <span>NEPAL 3</span>
            </div>

            <div className="d-flex">
              <div className="p-2 examinee-image">
                <img
                  src={`${process.env.REACT_APP_basePath}/img/logo.png`}
                  alt="{user.user.name}"
                  width="200"
                  height="200"
                />
              </div>
              {
                loading?
                <div className="p-2 flex-fill examinee-detail">
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
                 </div> 
                :
                <div className="p-2 flex-fill examinee-detail">
                <div className="examinee-info">
                  <span className="title">{`Examinee's Number`}</span>
                  <span className="detail">00345156984555</span>
                </div>
                <div className="examinee-info">
                  <span className="title">Name</span>
                  <span className="detail">{userData.user.name}</span>
                </div>
                <div className="examinee-info">
                  <span className="title">Phone</span>
                  <span className="detail">{userData.user.phone}</span>
                </div>
                {userData.user.category_name !== undefined &&
                  userData.user.category_name !== "" && (
                    <div className="examinee-info">
                      <span className="title">Industry</span>
                      <span className="detail">
                        {userData.user.category_name}
                      </span>
                    </div>
                  )}
              </div>
              }
              
            </div>
          </div>
          {
            !loading&&
            <div className="d-flex justify-content-center py-3">
            <a
              onClick={() => startExam()}
              href="#"
              className="btn btn-md btn-info"
            >
              Start Examination
            </a>
          </div>
          }
          
        </div>
      </div>
    )
  );
};

CbtStart.layout = "L2";
export default CbtStart;
