import React, { useContext, useState } from "react";
import Skeleton from '@mui/material/Skeleton';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useSnackbar } from "notistack";
import Timer from "../../../../components/timer";
import Player from "../../../../components/audioplayer";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { userContext } from "../../../../userContext";

const CbtReading = () => {
  const [setId, setSetId] = useState("");
  const [question, setQuestion] = useState({});
  const [chosenAnswerArray, setChosenAnswerArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [setDetail, setSetDetail] = useState({});
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const userData = useContext(userContext);

  const [searchParams, setSearchParams ] = useSearchParams();
  const question_no = searchParams.get('question_no');
  const navigate = useNavigate();

  

  const handleClose = () => {
    setOpen(false);
  };

  const getQuestion = async (sid) => {
    setLoading(true);
    const resp = await fetch(
      `${process.env.REACT_APP_apiUrl}api/v1/cbt/set/${sid}/question/${question_no}/reading`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + userData.token,
        },
      }
    );
    const data = await resp.json();
    if (resp.ok) {
      if (data.status) {
        if (data.payload.cbt) {
          setQuestion(data.payload.cbt[0]);
        } else {
          enqueueSnackbar("Question not found", { variant: "error" });
        }
      } else {
        enqueueSnackbar("Question not found", { variant: "error" });
      }
    } else {
      enqueueSnackbar("Question not found", { variant: "error" });
    }
    setLoading(false);
  };

  const checkSetExist = () => {
    if (
      localStorage.getItem("cbt_set_id") !== undefined &&
      localStorage.getItem("cbt_set_id") * 1 > 0
    ) {
      setSetId(localStorage.getItem("cbt_set_id"));
      return localStorage.getItem("cbt_set_id");
    } else {
      return false;
    }
  };

  const onTimeFinished = () => {
    // send to result page
    enqueueSnackbar("Your time is over", { variant: "error" });
    goToResult();
  };

  const getAnswers = async (sid) => {
    const resp = await fetch(
      `${process.env.REACT_APP_apiUrl}api/v1/cbt/set/${sid}/answers`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + userData.token,
        },
      }
    );
    const data = await resp.json();
    if (resp.ok) {
      if (data.status) {
        if (data.payload) {
          if (data.payload.answers.length > 0) {
            let arr = [];
            let arr1 = {};
            data.payload.answers.map((ans, key) => {
              arr1[ans.cbt_question_id] = ans.answer;
            });
            setChosenAnswerArray(arr1);
          }
        }
      } else {
        setChosenAnswerArray([]);
      }
    }
  };

  const chooseAnswer = async (id, qno, option, type) => {
    let ans = {... chosenAnswerArray}
    ans[id] = option;
    setChosenAnswerArray(ans);
    let body = {};
    body.questionId = id;
    body.answer = option;
    body.setId = setId;
    body.type = type === "AUDIO" ? "LISTENING" : "READING";

    const resp = await fetch(`${process.env.REACT_APP_apiUrl}api/v1/cbt/answer`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: "Bearer " + userData.token,
        "Content-Type": "application/json",
      },
    });
    const data = await resp.json();
    if (resp.ok) {
      if (data.status) {
        getAnswers(setId);
        enqueueSnackbar("Answer submitted", { variant: "success" });
      } else {
        enqueueSnackbar("Sorry answer could not be submitted", {
          variant: "error",
        });
      }
    }
  };

  const getPreviousQuestion = () => {
    let currentQuestion = question_no;
    let type = "reading";
    currentQuestion = currentQuestion * 1 - 1;
    if (currentQuestion > 0) {
      setQuestion({});
      if (currentQuestion > 20) type = "listening";
      navigate(`/cbt/exam/${type}?question_no=${currentQuestion}`);
    } else {
      enqueueSnackbar("This is the first question", { variant: "error" });
    }
  };

  const getNextQuestion = () => {
    let currentQuestion = question_no;
    currentQuestion = currentQuestion * 1 + 1;
    let type = "reading";
    if (currentQuestion <= 40) {
      setQuestion({});
      if (currentQuestion > 20) type = "listening";
      navigate(`/cbt/exam/${type}?question_no=${currentQuestion}`);
    } else {
      // end exam and got to result page
      setOpen(true);
    }
  };

  const gotoDashboard = () => {
    navigate("/cbt/exam/dashboard");
  };

  const goToResult = () => {
    navigate("/cbt/exam/result");
  };

  React.useEffect(() => {
    console.log(question_no);
    if (userData !== null && question_no) {
      const sid = checkSetExist();
      getQuestion(sid);
      getAnswers(sid);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, question_no]);
  let startTime = Date.now();
  if (typeof window !== "undefined") {
    startTime = localStorage.getItem("start_time");
  }

  return (
      <div className="single_question">
      <div className="dashboard">
          <div className="top-single">
            <div className="d-flex">
              <div className="top-menu flex-grow-1">
                <a href="#" className="back_link" onClick={gotoDashboard}>
                  <KeyboardBackspaceIcon fontSize="small" /> View all questions
                </a>
              </div>
              <div className="top-menu">
                {question_no <= 20 ? <>Reading</> : <>Listening</>}( 20
                questions )
              </div>
              <div className="top-menu">
                Whole question <span>40</span>
              </div>
              <div className="top-menu">
                Remaining question <span>{40 - question_no}</span>
              </div>
              <div className="top-menu">
                <span>
                  <Timer timeFinished={onTimeFinished} startTime={startTime} />
                </span>
              </div>
            </div>
          </div>

         
          <div className="main reading">
            <div className="d-flex">
              
              <div className="main_body flex-grow-1">
                {
                  loading?
                  <div className="question_number_box">
                    <Skeleton variant="text" width={`70%`} />
                    <Skeleton variant="rectangular" width={710} height={318} />
                  </div>  
                  :
                  <div className="question_number_box">
                  <h2>
                    [{question.question_number}]
                    {question.question_type === "TEXT" && (
                      <>{question.question}</>
                    )}
                  </h2>
                  {question.question_type === "IMAGE" && (
                    <h3>
                      <img
                        src={question.question}
                        height="300"
                        width="300"
                        alt=""
                      />
                    </h3>
                  )}

                  {question.question_type === "AUDIO" && (
                    <h3>
                      <Player file={question.question} />
                    </h3>
                  )}
                  {question.sub_question && question.sub_question !== "" && (
                    <div className="question">
                      <div className="text_box">
                        {question.sub_question_type === "TEXT" && (
                          <>{question.sub_question}</>
                        )}
                        {question.sub_question_type === "IMAGE" && (
                          <img
                            src={question.sub_question}
                            height="300"
                            width="300"
                            alt=""
                          />
                        )}
                        {question.sub_question_type === "AUDIO" && (
                          <Player file={question.sub_question} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
                }
                
              </div>
              {
                loading?
                <div className="sidebar">
                 <div className="question_all">
                  <div className="question_body"> 
                {
                  [...Array(1)].map((item, index) => (
                    <div key={index} style={{marginBottom:'30px'}}>
                     
                    <Skeleton variant="text" width={220} style={{marginTop:'40px'}}  />
                    <Skeleton variant="text" width={320} style={{marginTop:'20px'}} />
                    <Skeleton variant="text" width={220} style={{marginTop:'20px'}} />
                    <Skeleton variant="text" width={320} style={{marginTop:'20px'}} />
                    </div>
                ))
                }
                </div>
                </div>
                </div>:
                <div className="sidebar">
                <div className="question_all">
                  <div className="question_body">
                    <div className="options">
                      <ul>
                        <li>
                          <input
                            type="radio"
                            name="16"
                            id="1"
                            checked={
                              chosenAnswerArray[question.id] === "Option A"
                            }
                          />{" "}
                          <label
                            htmlFor="1"
                            className="d-flex"
                            onClick={() =>
                              chooseAnswer(
                                question.id,
                                question.question_number,
                                "Option A",
                                question.question_type
                              )
                            }
                          >
                            <span>1</span>
                            {question.option_type === "TEXT" && (
                              <>{question.option_a}</>
                            )}
                            {question.option_type === "IMAGE" && (
                              <img
                                src={question.option_a}
                                width="200"
                                height="200"
                                alt=""
                              />
                            )}
                            {question.option_type === "AUDIO" && (
                              <Player file={question.option_a} />
                            )}
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            name="16"
                            id="2"
                            checked={
                              chosenAnswerArray[question.id] === "Option B"
                            }
                          />{" "}
                          <label
                            htmlFor="2"
                            className="d-flex"
                            onClick={() =>
                              chooseAnswer(
                                question.id,
                                question.question_number,
                                "Option B",
                                question.question_type
                              )
                            }
                          >
                            <span>2</span>
                            {question.option_type === "TEXT" && (
                              <>{question.option_b}</>
                            )}
                            {question.option_type === "IMAGE" && (
                              <img
                                src={question.option_b}
                                width="200"
                                height="200"
                                alt=""
                              />
                            )}
                            {question.option_type === "AUDIO" && (
                              <Player file={question.option_b} />
                            )}
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            name="16"
                            id="3"
                            checked={
                              chosenAnswerArray[question.id] === "Option C"
                            }
                          />{" "}
                          <label
                            htmlFor="3"
                            className="d-flex"
                            onClick={() =>
                              chooseAnswer(
                                question.id,
                                question.question_number,
                                "Option C",
                                question.question_type
                              )
                            }
                          >
                            <span>3</span>
                            {question.option_type === "TEXT" && (
                              <>{question.option_c}</>
                            )}
                            {question.option_type === "IMAGE" && (
                              <img
                                src={question.option_c}
                                width="200"
                                height="200"
                                alt=""
                              />
                            )}
                            {question.option_type === "AUDIO" && (
                              <Player file={question.option_c} />
                            )}
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            name="16"
                            id="4"
                            checked={
                              chosenAnswerArray[question.id] === "Option D"
                            }
                          />{" "}
                          <label
                            htmlFor="4"
                            className="d-flex"
                            onClick={() =>
                              chooseAnswer(
                                question.id,
                                question.question_number,
                                "Option D",
                                question.question_type
                              )
                            }
                          >
                            <span>4</span>
                            {question.option_type === "TEXT" && (
                              <>{question.option_d}</>
                            )}
                            {question.option_type === "IMAGE" && (
                              <img
                                src={question.option_d}
                                width="200"
                                height="200"
                                alt=""
                              />
                            )}
                            {question.option_type === "AUDIO" && (
                              <Player file={question.option_d} />
                            )}
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="final_submit">
                  <div className="d-flex">
                    <a
                      href="#"
                      className="flex-even"
                      onClick={getPreviousQuestion}
                    >
                      <ChevronLeftIcon fontSize="small" />
                      Previous Question
                    </a>
                    <a href="#" className="flex-even" onClick={getNextQuestion}>
                      Next Question <ChevronRightIcon fontSize="small" />
                    </a>
                  </div>
                </div>
              </div>
              }

              


            </div>
          </div>
        </div>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This is your last question. Go to result page?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={goToResult} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
  );
};

CbtReading.layout = "L2";
export default CbtReading;
