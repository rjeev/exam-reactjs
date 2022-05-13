import React, { useContext, useState } from "react";
import { useSnackbar } from "notistack";
import Timer from "../../../../components/timer";
import Player from "../../../../components/audioplayer";
import Skeleton from '@mui/material/Skeleton';

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { userContext } from "../../../../userContext";
import { useNavigate } from "react-router-dom";

const CbtDashboard = () => {
  const [setId, setSetId] = useState("");
  const [setDetail, setSetDetail] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [ansArray, setAnsArray] = useState([]);
  const [chosenAnswerArray, setChosenAnswerArray] = useState({});
  const [loading, setLoading] = useState(false);
  const [showQuestionType, setShowQuestionType] = useState("whole");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const userData = useContext(userContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const getSetDetail = async (sid) => {
    setLoading(true);
    const resp = await fetch(`${process.env.REACT_APP_apiUrl}api/v1/cbt/${sid}`, {
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
  };

  const gotoResult = () => {
    navigate("/cbt/exam/result");
  };

  const handleClose = () => {
    setOpen(false);
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
          setAnswers(data.payload.answers);
          if (data.payload.answers.length > 0) {
            let arr = [];
            let arr1 = {};
            data.payload.answers.map((ans, key) => {
              arr.push(ans.question_number);
              arr1[ans.cbt_question_id] = ans.answer;
            });
            setAnsArray(arr);
            setChosenAnswerArray(arr1);
          }
        }
      } else {
        setAnswers([]);
      }
    }
  };

  const chooseAnswer = async (id, qno, option, type) => {
    let ans = { ...chosenAnswerArray };
    let ans1 = [...ansArray];
    ans[id] = option;
    ans1.push(qno);
    setChosenAnswerArray(ans);
    setAnsArray(ans1);
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
      } else {
      }
    }
  };

  const getQuestions = async (sid) => {

    const resp = await fetch(
      `${process.env.REACT_APP_apiUrl}api/v1/cbt/${sid}/questions`,
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
        setQuestions(data.payload.cbt);
      } else {
        setQuestions([]);
      }
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
    gotoResult();
  };

  const gotoSingleQuestion = (question) => {
    let type = "reading";
    if (question * 1 > 20) type = "listening";
    navigate(`/cbt/exam/${type}?question_no=${question}`);
  };

  const showQuestion = (type) => {
    setShowQuestionType(type);
  };

  React.useEffect(() => {
    if (userData !== null) {
      const sid = checkSetExist();
      if (sid) {
        getSetDetail(sid);
        getQuestions(sid);
        getAnswers(sid);
      } else {
        enqueueSnackbar("No question set selected", { variant: "error" });
      }
    }
  }, [userData]);
  let startTime = Date.now();
  if (typeof window !== "undefined") {
    startTime = localStorage.getItem("start_time");
  }

  return userData ? (
    <div className="dashboard">
      <div className="top">
        <div className="d-flex">
          <div className="user_image">
            <img
              src={`${process.env.REACT_APP_basePath}/img/logo.png`}
              width="60"
              height="60"
              alt="{user.user.user.name}"
            />
          </div>
          <div className="flex-grow-1 exam-detail">
            <div className="row top-row">
              <div className="col">
                <span className="px-2 user_set">{setDetail.set_name}</span>
              </div>
              <div className="col">
                <span className="px-2 user_id">
                  {userData.user.email}
                </span>
              </div>
              <div className="col">
                <span className="px-2 user_name">
                  {userData.user.name}
                </span>
              </div>
            </div>

            <div className="d-flex top-row">
              <div className="flex-fill country">
                <span className="">Nepal 3</span>
              </div>
              <div className="flex-fill question_tab">
                <ul className="">
                  <li className="active">
                    <a
                      href="#"
                      className=""
                      onClick={() => showQuestion("whole")}
                    >
                      Whole Question
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className=""
                      onClick={() => showQuestion("solved")}
                    >
                      Solved Question
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className=""
                      onClick={() => showQuestion("unsolved")}
                    >
                      Unsolved Question
                    </a>
                  </li>
                </ul>
              </div>
              <div className="flex-fill timer">
                <span className="">
                  <Timer timeFinished={onTimeFinished} startTime={startTime} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main">
        <div className="d-flex">
          <div className="main-left flex-grow-1">
            <div className="question_number_box">
              <h2>Reading (20 questions)</h2>
              <ul className="question_numbers">
                {[...Array(20)].map((arr, index) => {
                  let ansClass = "";
                  if (ansArray.indexOf(index + 1) !== -1) {
                    ansClass = "answered";
                  }
                  return (
                    <>
                      {showQuestionType === "solved" &&
                        ansClass === "answered" && (
                          <li key={index} className={ansClass}>
                            <a
                              href="#"
                              onClick={() => gotoSingleQuestion(index + 1)}
                            >
                              {index + 1}
                            </a>
                          </li>
                        )}
                      {showQuestionType === "unsolved" &&
                        ansClass != "answered" && (
                          <li key={index} className={ansClass}>
                            <a
                              href="#"
                              onClick={() => gotoSingleQuestion(index + 1)}
                            >
                              {index + 1}
                            </a>
                          </li>
                        )}
                      {showQuestionType === "whole" && (
                        <li key={index} className={ansClass}>
                          <a
                            href="#"
                            onClick={() => gotoSingleQuestion(index + 1)}
                          >
                            {index + 1}
                          </a>
                        </li>
                      )}
                    </>
                  );
                })}
              </ul>
            </div>

            <div className="question_number_box">
              <h2>Listening (20 questions)</h2>
              <ul className="question_numbers">
                {[...Array(20)].map((arr, index) => {
                  let ansClass = "";
                  if (ansArray.indexOf(index + 21) !== -1) {
                    ansClass = "answered";
                  }
                  return (
                    <>
                      {showQuestionType === "solved" &&
                        ansClass === "answered" && (
                          <li key={index + 21} className={ansClass}>
                            <a
                              href="#"
                              onClick={() => gotoSingleQuestion(index + 21)}
                            >
                              {index + 21}
                            </a>
                          </li>
                        )}
                      {showQuestionType === "unsolved" &&
                        ansClass != "answered" && (
                          <li key={index + 21} className={ansClass}>
                            <a
                              href="#"
                              onClick={() => gotoSingleQuestion(index + 21)}
                            >
                              {index + 21}
                            </a>
                          </li>
                        )}
                      {showQuestionType === "whole" && (
                        <li key={index + 21} className={ansClass}>
                          <a
                            href="#"
                            onClick={() => gotoSingleQuestion(index + 21)}
                          >
                            {index + 21}
                          </a>
                        </li>
                      )}
                    </>
                  );
                })}
              </ul>
            </div>
          </div>

          <div>
            {
              loading ?
                <>
                  <div className="question_all">
                    {
                      [...Array(5)].map((item, index) => (
                        <div key={index} style={{ marginBottom: '30px' }}>
                          <Skeleton variant="text" />
                          <Skeleton variant="rectangular" width={310} height={218} />
                          <Skeleton variant="text" width={320} />
                          <Skeleton variant="text" width={320} />
                          <Skeleton variant="text" width={320} />
                          <Skeleton variant="text" width={320} />
                        </div>
                      ))
                    }
                  </div>
                </>
                :
                <div className="question_all">
                  {questions.length > 0 &&
                    questions.map((q, key) => {
                      let questionClass = "question_body";
                      if (q.option_type === "IMAGE") {
                        questionClass += " option_image";
                      }

                      return (
                        <div className={questionClass} key={key}>
                          <div className="question">
                            <h3>
                              <span className="numbering">
                                [{q.question_number}]
                              </span>
                              {q.question_type === "TEXT" && <>{q.question}</>}
                              {q.question_type === "IMAGE" && (
                                <img
                                  src={q.question}
                                  height="200"
                                  width="200"
                                  alt=""
                                />
                              )}

                              {q.question_type === "AUDIO" && (
                                <Player file={q.question} />
                              )}
                            </h3>
                            <p>
                              {q.sub_question_type === "TEXT" && (
                                <>{q.sub_question}</>
                              )}
                              {q.sub_question_type === "IMAGE" && (
                                <img
                                  src={q.sub_question}
                                  height="200"
                                  width="200"
                                  alt=""
                                />
                              )}
                              {q.sub_question_type === "AUDIO" && (
                                <Player file={q.sub_question} />
                              )}
                            </p>
                          </div>
                          <div className="options">
                            <ul>
                              <li>
                                <input
                                  type="radio"
                                  name={q.question_number + "option_a"}
                                  checked={chosenAnswerArray[q.id] === "Option A"}
                                />
                                <label
                                  htmlFor={q.question_number + "option_a"}
                                  className="d-flex"
                                  onClick={() =>
                                    chooseAnswer(
                                      q.id,
                                      q.question_number,
                                      "Option A",
                                      q.question_type
                                    )
                                  }
                                >
                                  <span>1</span>
                                  {q.option_type === "TEXT" && <>{q.option_a}</>}
                                  {q.option_type === "IMAGE" && (
                                    <img
                                      src={q.option_a}
                                      width="200"
                                      height="200"
                                      alt=""
                                    />
                                  )}
                                  {q.option_type === "AUDIO" && (
                                    <Player file={q.option_a} />
                                  )}
                                </label>
                              </li>
                              <li>
                                <input
                                  type="radio"
                                  name={q.question_number + "option_b"}
                                  checked={chosenAnswerArray[q.id] === "Option B"}
                                />
                                <label
                                  htmlFor={q.question_number + "option_b"}
                                  className="d-flex"
                                  onClick={() =>
                                    chooseAnswer(
                                      q.id,
                                      q.question_number,
                                      "Option B",
                                      q.question_type
                                    )
                                  }
                                >
                                  <span>2</span>
                                  {q.option_type === "TEXT" && <>{q.option_b}</>}
                                  {q.option_type === "IMAGE" && (
                                    <img
                                      src={q.option_b}
                                      width="200"
                                      height="200"
                                      alt=""
                                    />
                                  )}
                                  {q.option_type === "AUDIO" && (
                                    <Player file={q.option_b} />
                                  )}
                                </label>
                              </li>
                              <li>
                                <input
                                  type="radio"
                                  name={q.question_number + "option_c"}
                                  checked={chosenAnswerArray[q.id] === "Option C"}
                                />
                                <label
                                  htmlFor={q.question_number + "option_c"}
                                  className="d-flex"
                                  onClick={() =>
                                    chooseAnswer(
                                      q.id,
                                      q.question_number,
                                      "Option C",
                                      q.question_type
                                    )
                                  }
                                >
                                  <span>3</span>
                                  {q.option_type === "TEXT" && <>{q.option_c}</>}
                                  {q.option_type === "IMAGE" && (
                                    <img
                                      src={q.option_c}
                                      width="200"
                                      height="200"
                                      alt=""
                                    />
                                  )}
                                  {q.option_type === "AUDIO" && (
                                    <Player file={q.option_c} />
                                  )}
                                </label>
                              </li>
                              <li>
                                <input
                                  type="radio"
                                  name={q.question_number + "option_d"}
                                  checked={chosenAnswerArray[q.id] === "Option D"}
                                />
                                <label
                                  htmlFor={q.question_number + "option_d"}
                                  className="d-flex"
                                  onClick={() =>
                                    chooseAnswer(
                                      q.id,
                                      q.question_number,
                                      "Option D",
                                      q.question_type
                                    )
                                  }
                                >
                                  <span>4</span>
                                  {q.option_type === "TEXT" && <>{q.option_d}</>}
                                  {q.option_type === "IMAGE" && (
                                    <img
                                      src={q.option_d}
                                      width="200"
                                      height="200"
                                      alt=""
                                    />
                                  )}
                                  {q.option_type === "AUDIO" && (
                                    <Player file={q.option_d} />
                                  )}
                                </label>
                              </li>
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                </div>
            }

            <div className="final_submit">
              <input
                type="button"
                value="Submit Answer"
                onClick={() => setOpen(true)}
              />
            </div>
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
            Are you sure you want to submit all your answers?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={gotoResult} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  ) : (
    <></>
  );
};

CbtDashboard.layout = "L2";
export default CbtDashboard;
