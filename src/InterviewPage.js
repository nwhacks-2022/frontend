import React, { useEffect, useState } from "react";
import { ReactMic } from "react-mic";
import axios from "axios";
import pageStyles from "./Page.module.css";
import styles from "./InterviewPage.module.css";

import robotCryImg from "./image/robots/cry.png";
import robotSmileImg from "./image/robots/smile.png";
import robotRecordingImg from "./image/robots/recording.png";

let recordingEvent;

const RecordPage = (props) => {
  const [loading, setLoading] = useState(true);
  const [questionsAnswered, setQuestionsAnswered] = useState(-1);
  const [questionList, setQuestionList] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    const func = async () => {
      setQuestionList(await getQuestions(5));
      setQuestionsAnswered(0);
      setCurrentQuestionIndex(0);
      setTimeout(() => setLoading(false), Math.random() * 500 + 400);
    };
    func();
  }, []);

  useEffect(() => {
    if (questionList.length !== 0) {
      if (currentQuestionIndex === questionList.length) {
        props.viewHistory(questionsAnswered);
      }
    }
  }, [currentQuestionIndex]);

  const durationAsString = () => {
    let minutes = Math.floor(duration / 60)
      .toString()
      .padStart(2, "0");
    let seconds = (duration % 60).toString().padStart(2, "0");
    return minutes + ":" + seconds;
  };

  const tickDuration = () => {
    setDuration((prevState) => prevState + 1);
  };

  const getCurrentQuestion = () => {
    return questionList[currentQuestionIndex];
  };

  const nextQuestion = (solved) => {
    if (solved) {
      setQuestionsAnswered((prevState) => prevState + 1);
    }
    setCurrentQuestionIndex((prevState) => prevState + 1);
  };

  const getQuestions = async (questionCount) => {
    let res = await axios.get("https://nwhacks2022.herokuapp.com/question", {
      params: { count: questionCount },
    });
    return res.data;
  };

  const handleRecording = () => {
    if (!recording) {
      setDuration(0);
      recordingEvent = setInterval(tickDuration, 1000);
    }
    setRecording(!recording);
  };

  const onRecordStop = async (recordedBlob) => {
    clearInterval(recordingEvent);
    setDuration(0);
    setLoading(true);
    let data = await uploadRecording(recordedBlob);
    nextQuestion(true);
    setLoading(false);
  };

  const uploadRecording = (recordedBlob) => {
    return new Promise((resolve) => {
      fetch(recordedBlob.blobURL)
        .then((res) => res.blob())
        .then(async (blob) => {
          // Create formdata.
          let file = new File([blob], "recording.webm", {
            type: recordedBlob.blob.type,
          });
          let formData = new FormData();
          formData.append("question", getCurrentQuestion()); // FIXME: getCurrentQuestion() grabs the wrong question for some reason.
          formData.append("file", file);
          // Upload audio.
          let res = await axios({
            method: "post",
            url: "https://nwhacks2022.herokuapp.com/upload",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
          });
          resolve(res);
        });
    });
  };

  if (loading) {
    return (
      <div className={pageStyles["loading-wrapper"]}>
        <div className={pageStyles["spinner"]} />
      </div>
    );
  }

  if (!questionList || questionList.length === 0) {
    return (
      <div className={pageStyles["error-wrapper"]}>
        <img src={robotCryImg} alt="robot" />
        <div>
          No interview questions found 😭
          <br />
          Sorry for the troubles...
        </div>
      </div>
    );
  }

  return (
    <div className={pageStyles["wrapper"]}>
      <h2>Question</h2>
      <div
        className={[
          styles["question-wrapper"],
          pageStyles["scroll-wrapper"],
        ].join(" ")}
      >
        <div>
          <div>{getCurrentQuestion()}</div>
        </div>
      </div>
      <div className={styles["time-elapsed"]}>{durationAsString()}</div>
      <ReactMic
        record={recording}
        onStop={onRecordStop}
        channelCount={1}
        strokeColor="#4193bf"
        backgroundColor="#ffffff"
      />
      <div />
      <button
        className={[
          styles["record-button"],
          recording ? styles["recording"] : null,
        ].join(" ")}
        style={{ position: "relative" }}
        onClick={handleRecording}
      >
        {recording ? "Finish Recording" : "Record Answer"}
        <img
          src={recording ? robotRecordingImg : robotSmileImg}
          width="64px"
          alt="robot"
          style={{ position: "absolute", bottom: "80%", right: "1em" }}
        />
      </button>
      <button
        className={styles["skip-button"]}
        onClick={() => nextQuestion(false)}
      >
        Skip Question
      </button>
    </div>
  );
};

export default RecordPage;
