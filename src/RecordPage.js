import React, { useEffect, useState } from "react";
import { ReactMic } from "react-mic";
import axios from "axios";
import pageStyles from "./Page.module.css";
import styles from "./RecordPage.module.css";

import robotSmileImg from "./image/robots/smile.png";
import robotRecordingImg from "./image/robots/recording.png";

let recordingEvent;

const RecordPage = (props) => {
  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(undefined);
  const [duration, setDuration] = useState(0);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    const func = async () => {
      setQuestionList(await getQuestions(3));
      setCurrentQuestionIndex(0);
      setTimeout(() => setLoading(false), Math.random() * 1000 + 400);
    };
    func();
  }, []);

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
    if (currentQuestionIndex === undefined) {
      return "ERROR: No questions found D:";
    }
    return questionList[currentQuestionIndex];
  };

  const nextQuestion = () => {
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
    let data = await uploadRecording(recordedBlob);
    // console.log(data);
    nextQuestion();
  };

  const uploadRecording = (recordedBlob) => {
    return new Promise((resolve) => {
      fetch(recordedBlob.blobURL)
        .then((res) => res.blob())
        .then(async (blob) => {
          // Create formdata.
          let file = new File([blob], "test.webm", {
            type: "audio/webm",
          });
          let formData = new FormData();
          formData.append("question", getCurrentQuestion());
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
        <div>Preparing questions...</div>
      </div>
    );
  }

  return (
    <div className={pageStyles["wrapper"]}>
      <h2>Question</h2>
      <div className={styles["question-wrapper"]}>
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
        backgroundColor="#fffdf6"
      />
      <div />
      <img
        src={recording ? robotRecordingImg : robotSmileImg}
        width="64px"
        style={{ position: "absolute", bottom: "160px", right: "48px" }}
        alt="robot"
      />
      <button
        className={[
          styles["record-button"],
          recording ? styles["recording"] : null,
        ].join(" ")}
        onClick={handleRecording}
      >
        {recording ? "Finish Recording" : "Record Answer"}
      </button>
      <button className={styles["skip-button"]}>Skip Question</button>
    </div>
  );
};

export default RecordPage;
