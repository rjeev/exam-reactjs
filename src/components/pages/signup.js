import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSnackbar } from "notistack";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from "react-router";


export default function Register() {
  const [loginHref, setRegisterHref] = useState("/login");
  const [cbtCategories, setCbtCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const d = {
    name : data.fullNameRequired,
    email : data.emailRequired,   
    phone : data.phoneRequired,     
    password : data.passwordRequired,
    confirm_password : data.confirmPasswordRequired,     
    cbt_category_id : data.categoryRequired   
  }
    setLoading(true);
    const resp = await fetch(`${process.env.REACT_APP_apiUrl}api/v1/registeruser`, {
      body: JSON.stringify(d),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const respData = await resp.json();
    if (resp.ok) {
      setLoading(false);
      if (respData.success && respData.success.msg === 'Registration successfull') {
        enqueueSnackbar("Registration successfull, please login to continue", {
          variant: "success",
        });
        navigate("/login");
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

  const getAllCBTCategories = async () => {
    setLoading(true);
    const resp = await fetch(`${process.env.REACT_APP_apiUrl}api/v1/cbt/categories`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    const respData = await resp.json();
    if (resp.ok) {
      if (respData.status) {
        setCbtCategories(respData.payload);
      } else {
      }
    } else {
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate(loginHref);
  };

  const isValidEmail = (email) =>
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );

  const confirmPasswordValidation = (pass) => {
    if (watch("passwordRequired") !== watch("confirmPasswordRequired")) {
      return false;
    }
    return true;
  };

  const handleEmailValidation = (email) => {
    const isValid = isValidEmail(email);
    const validityChanged =
      (errors.emailRequired && isValid) || (!errors.emailRequired && !isValid);
    if (validityChanged) {
      console.log("Fire tracker with", isValid ? "Valid" : "Invalid");
    }
    return isValid;
  };

  useEffect(() => {
    getAllCBTCategories();
  }, []);

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
                  className="form-horizontal register-form"
                  method="post"
                  action="#"
                >
                  <h3 className="text-center mb-3">Register</h3>

                  <div className="form-group mb-2">
                    <div className="cols-sm-10">
                      <div className="input-group">
                        <input
                          {...register("fullNameRequired", { required: true })}
                          className={
                            errors.fullNameRequired
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          placeholder="Name"
                        />
                        {errors.fullNameRequired && (
                          <div className="invalid-feedback">
                            This field is required
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-2">
                    <div className="cols-sm-10">
                      <div className="input-group">
                        <input
                          type="text"
                          {...register("emailRequired", {
                            validate: handleEmailValidation,
                          })}
                          className={
                            errors.emailRequired
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          name="emailRequired"
                          id="emailRequired"
                          placeholder="Email"
                        />
                        {errors.emailRequired && (
                          <div className="invalid-feedback">
                            This field is required
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-2">
                    <div className="cols-sm-10">
                      <div className="input-group">
                        <input
                          type="text"
                          {...register("phoneRequired", { required: true })}
                          className={
                            errors.phoneRequired
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          placeholder="Mobile Number"
                        />
                        {errors.phoneRequired && (
                          <div className="invalid-feedback">
                            This field is required
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-2">
                    <div className="cols-sm-10">
                      <div className="input-group">
                        <select
                          className={
                            errors.categoryRequired
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          {...register("categoryRequired", { required: true })}
                        >
                          <option value="">Choose Category</option>
                          {cbtCategories !== undefined &&
                            cbtCategories.length > 0 &&
                            cbtCategories.map(
                              (categories: cbtCategoryItem, key) => {
                                return (
                                  <option
                                    key={categories.id}
                                    value={categories.id}
                                  >
                                    {categories.category_name}
                                  </option>
                                );
                              }
                            )}
                        </select>
                        {errors.categoryRequired && (
                          <div className="invalid-feedback">
                            This field is required
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-2">
                    <div className="cols-sm-10">
                      <div className="input-group">
                        <input
                          type="password"
                          {...register("passwordRequired", {
                            required: true,
                            min: 6,
                          })}
                          className={
                            errors.passwordRequired
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          placeholder="Password"
                        />
                        {errors.passwordRequired && (
                          <div className="invalid-feedback">
                            Required field minimum 6 characters
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-2">
                    <div className="cols-sm-10">
                      <div className="input-group">
                        <input
                          type="password"
                          {...register("confirmPasswordRequired", {
                            validate: confirmPasswordValidation,
                            min: 6,
                          })}
                          className={
                            errors.confirmPasswordRequired
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          placeholder="Confirm Password"
                        />
                        {errors.confirmPasswordRequired && (
                          <div className="invalid-feedback">
                            Confirm password does not match
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-2">
                  {
                        loading?
                          <LoadingButton
                        loading
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        className="btn-info btn-md btn-block"
                      >
                        Waiting...
                      </LoadingButton>:
                        <button
                        type="submit"
                        className="btn btn-info btn-block login-button"
                      >
                        Register
                      </button>
                    }  
 
                  </div>
                  <div className="login-register">
                    <a
                      href={loginHref}
                      onClick={handleLogin}
                      className="text-info"
                    >
                      Login
                    </a>
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

Register.layout = "L2";
