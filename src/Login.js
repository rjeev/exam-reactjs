import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSnackbar } from "notistack";
import cookieCutter from "cookie-cutter";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from "react-router";

export default function Login() {
  const [registerHref, setRegisterHref] = useState("/register");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate(registerHref);
  };

  const isValidEmail = (email) =>
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );

  const handleEmailValidation = (email) => {
    const isValid = isValidEmail(email);
    const validityChanged =
      (errors.email && isValid) || (!errors.email && !isValid);
    if (validityChanged) {
      console.log("Fire tracker with", isValid ? "Valid" : "Invalid");
    }
    return isValid;
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const onSubmit = async (data) => {
    setLoading(true);
    const resp = await fetch(`${process.env.REACT_APP_apiUrl}api/v1/login`, {
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const respData = await resp.json();
    if (resp.ok) {
      setLoading(false);
      if (respData.success.msg === "Login successfull") {
        localStorage.setItem(
          `${process.env.REACT_APP_COOKIE_NAME}`,
          JSON.stringify(respData.success)
        );
        cookieCutter.set(
          `${process.env.REACT_APP_COOKIE_NAME}`,
          JSON.stringify(respData.success)
        );
        // redirect to login page  // get token
        window.location.href = '/choosetest'
      } else {
        reset();
        enqueueSnackbar(respData.error, { variant: "error" });
      }
    } else {
      setLoading(false);
      reset();
      enqueueSnackbar(respData.error, { variant: "error" });
    }
  };
  
  return (
    <div id="wrapper">
      <div id="login">
        <span className="logo">
          <img
            src={`${process.env.REACT_APP_basePath}/img/logo.png`}
            width="200"
            height="200"
            alt="company"
          />
        </span>
        <div className="container">
          <div
            id="login-row"
            className="row justify-content-center align-items-center"
          >
            <div id="login-column" className="col-md-8">
              <div id="login-box" className="col-md-12">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  id="login-form"
                  className="form"
                  action="#"
                  method="post"
                >
                  <h3 className="text-center mb-30">Login</h3>
                  <div className="form-group">
                    <input
                      type="text"
                      {...register("email", {
                        validate: handleEmailValidation,
                      })}
                      className={
                        errors.email
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="email"
                      id="email"
                      placeholder="Email"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        This field is required
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      {...register("password", { required: true })}
                      className={
                        errors.password
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      placeholder="Password"
                    />
                    {errors.password && (
                      <div className="invalid-feedback">
                        This field is required
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                      {
                        loading?
                        <LoadingButton
                        loading
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        className="btn-info btn-md"
                      >
                        Login
                      </LoadingButton>:
                      <input
                      type="submit"
                      name="submit"
                      className="btn btn-info btn-md btn-block"
                      value="Login"
                    />
                      }
                      

                        
                      </div>
                      <div id="register-link" className="text-center">
                        <a
                          href={registerHref}
                          onClick={handleRegister}
                          className="text-info"
                        >
                          Register here
                        </a>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

