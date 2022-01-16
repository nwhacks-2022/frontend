import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./QuestionsPage.module.css";
import pageStyles from "./Page.module.css";

import robotCryImg from "./image/robots/cry.png";

const QuestionsPage = (props) => {
  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState([]);

  useEffect(() => {
    const func = async () => {
      setQuestionList(await getQuestions());
      setTimeout(() => setLoading(false), Math.random() * 500 + 400);
    };
    func();
  }, []);

  const getQuestions = async () => {
    let res = await axios.get("https://nwhacks2022.herokuapp.com/question", {
      params: { count: 1000 },
    });
    return res.data;
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
      <h2>Question Bank</h2>
      <div
        className={[styles["list-wrapper"], pageStyles["scroll-wrapper"]].join(
          " "
        )}
      >
        <div>
          {questionList.map((item, i) => (
            <>
              <div key={2 * i}>{item}</div>
              {i < questionList.length - 1 && (
                <div key={2 * i + 1} className="hr" />
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
