import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useForm, SubmitHandler } from "react-hook-form";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { userContext } from "../../userContext";



const Profile = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm() ;
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: ""
  });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadContent, setLoadContent] = useState(true);
  const userData = useContext(userContext)

  const getUserProfile = async () => {
    setLoadContent(true);
    const resp = await fetch(`${process.env.REACT_APP_apiUrl}api/v1/user`, {
      method: "GET",
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer '+ userData.token
      }, 
    });
    const respData = await resp.json();
    if (resp.ok) {
      if (respData.payload) {
        setValue("fullName", respData.payload.user.name);
        setValue("email", respData.payload.user.email);
        setValue("phone", respData.payload.user.phone);
        setValue("address", respData.payload.user.address);
        let profile = {};
        profile.fullName = respData.payload.user.name;
        profile.email = respData.payload.user.email;
        profile.phone = respData.payload.user.phone;
        profile.address = respData.payload.user.address;
        setProfileData(profile);
      }
    }
    setLoadContent(false);
  };

  const onSubmit = async (data) => {
    let d = data;
    d.name = data.fullName;
    setLoading(true);
    const resp = await fetch(`${process.env.REACT_APP_apiUrl}api/v1/user/profile`, {
      body: JSON.stringify(data),
      method: "PUT",
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ userData.token
      }, 
    });
    const respData = await resp.json();
    if (resp.ok) {
      setLoading(false);
      if (respData.status) {
        getUserProfile();
        enqueueSnackbar("Profile updated successfully", { variant: "success" });
      } else {
        enqueueSnackbar(respData.payload.error, { variant: "error" });
      }
    } else {
      setLoading(false);
      reset();
      enqueueSnackbar(respData.payload.error, { variant: "error" });
    }
    setShowProfileForm(false);
  };
  const confirmPasswordValidation = (pass) => {
    if (watch("password") !== watch("confirmPassword")) {
      return false;
    }
    return true;
  };

  

  const setFormVal = (
    event,
    type
  ) => {
    setValue(type, event.target.value);
  };

  useEffect(() => {
    if (userData !== null) {
      getUserProfile();
    }
    
  }, [userData]);

  return (
    <div id="wrapper">
      <div className="profile-body">
        {
          loadContent&&
          <div className="row align-items-center">
             <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="profile">
              <div className="d-flex flex-column align-items-center text-center p-5">
              <Box sx={{ width: 200 }} style={{textAlign:'center'}}>
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
              </Box>
              </div>
          </div>
          </div>
          </div>
        }

        {
          !loadContent&&
          <>
        <div className="row align-items-center">
          {
            !showProfileForm &&
            <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="profile">
              <div className="d-flex flex-column align-items-center text-center p-5">
                {profileData && (
                  <>
                    <span className="font-weight-bold">
                      {profileData.fullName}
                    </span>
                    <span className="text-black-50">{profileData.email}</span>
                    <span className="text-black-50">{profileData.phone}</span>
                    <span>{profileData.address}</span>
                  </>
                )}
              </div>
              <div className="d-flex justify-content-between align-items-center px-3 pb-3">
                <div>
                  <button className="btn btn-sm btn-success" onClick={()=>setShowProfileForm(true)}>
                    Update
                  </button>
                </div>
                <div>
                  {/* <button className="btn btn-sm btn-danger float-right">
                    Change Password
                  </button> */}
                </div>
              </div>
            </div>
          </div>
          }
          
        </div>
        {showProfileForm &&
        <div className="row mt-3">
        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="profile">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="form-horizontal register-form"
              method="post"
              action="#"
            >
              <div className="row">
                <div className="col-sm-12">
                  <input
                    {...register("fullName", { required: true })}
                    onChange={(e) => setFormVal(e, "fullName")}
                    className={
                      errors.fullName
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    placeholder="Full name"
                  />
                  {errors.fullName && (
                    <div className="invalid-feedback">
                      This field is required
                    </div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 mt-2">
                  <input
                    {...register("email")}
                    readOnly
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    onChange={(e) => setFormVal(e, "email")}
                  />
                </div>
                <div className="col-sm-6 mt-2">
                  <input
                    type="text"
                    {...register("phone", { required: true })}
                    onChange={(e) => setFormVal(e, "phone")}
                    className={
                      errors.phone
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    placeholder="Mobile Number"
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">
                      This field is required
                    </div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 mt-2">
                  <input
                    type="text"
                    {...register("address")}
                    onChange={(e) => setFormVal(e, "address")}
                    className={
                      errors.address
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    placeholder="Address"
                  />
                  {errors.address && (
                    <div className="invalid-feedback">
                      This field is required
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6 mt-2">
                  <input
                    type="password"
                    {...register("password", { min: 6 })}
                    onChange={(e) => setFormVal(e, "password")}
                    className={
                      errors.password
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    placeholder="Password"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">
                      Required field minimum 6 characters
                    </div>
                  )}
                </div>
                <div className="col-sm-6 mt-2">
                  <input
                    type="password"
                    {...register("confirmPassword", {
                      validate: confirmPasswordValidation,
                      min: 6,
                    })}
                    onChange={(e) => setFormVal(e, "confirmPassword")}
                    className={
                      errors.confirmPassword
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    placeholder="Confirm Password"
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      Confirm password does not match
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 text-right">
              {
                loading?
                <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<SaveIcon />}
                className="btn-primary profile-button"
              >Save</LoadingButton>:     
                 <button
                  className="btn btn-primary profile-button"
                  type="submit"
                >
                  Save
                </button>
              }    
                
               
              </div>
            </form>
          </div>
        </div>
          </div>
        }
        </>
        }
        
      </div>
    </div>
  );
};

Profile.layout = "L1";
export default Profile;
