import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./HistoryPage.module.css";
import pageStyles from "./Page.module.css";

import robotMonocleImg from "./image/robots/monocle.png";
import robotSadTearImg from "./image/robots/sadTear.png";
import robotBruhImg from "./image/robots/bruh.png";
import robotUghImg from "./image/robots/ugh.png";
import robotSmileImg from "./image/robots/smile.png";
import robotSparkleImg from "./image/robots/sparkle.png";
import robotRainbowImg from "./image/robots/rainbow.png";

const HistoryPage = (props) => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const func = async () => {
      setHistory(await getHistory(props.itemCount));
      props.setItemCount(-1);
      setTimeout(() => setLoading(false), Math.random() * 500 + 400);
    };
    func();
  }, []);

  const getHistory = async (itemCount) => {
    let params = itemCount !== -1 ? { count: itemCount } : {};
    let res = await axios.get("https://nwhacks2022.herokuapp.com/history", {
      params: params,
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

  if (!history || history.length === 0) {
    return (
      <div className={pageStyles["error-wrapper"]}>
        <img src={robotSadTearImg} alt="robot" />
        <div>
          No previous answers found 😢
          <br />
          Try a mock interview!
        </div>
      </div>
    );
  }

  return (
    <div className={pageStyles["wrapper"]}>
      <h2>Past Answers</h2>
      <div
        className={[styles["list-wrapper"], pageStyles["scroll-wrapper"]].join(
          " "
        )}
      >
        <div>
          {history.map((item, i) => (
            <>
              <HistoryItem
                key={2 * i}
                question={item.question}
                audioSrc={item.link}
                wpm={item.wpm}
                variance={item.variance}
              />
              {i < history.length - 1 && <div key={2 * i + 1} className="hr" />}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

const HistoryItem = (props) => {
  const getImg = () => {
    let s = score();
    if (s < 0) {
      return robotMonocleImg;
    } else if (s < 1) {
      return robotBruhImg;
    } else if (s < 2) {
      return robotUghImg;
    } else if (s < 3) {
      return robotSmileImg;
    } else if (s < 4) {
      return robotSparkleImg;
    } else {
      return robotRainbowImg;
    }
  };
  const renderWPM = () => {
    return (
      <div className={styles["stat-small"]} style={{ marginTop: "0.5em" }}>
        WPM: {Math.round(props.wpm)}
      </div>
    );
  };
  const renderVariance = () => {
    if (props.variance < 0) {
      return null;
    }
    if (props.variance === undefined) {
      return (
        <div className={styles["stat-small"]}>Calculating SD of Speed...</div>
      );
    }
    return (
      <div className={styles["stat-small"]}>
        SD of Speed: {Math.round(Math.sqrt(props.variance))}
      </div>
    );
  };
  const renderScore = () => {
    return (
      <div className={styles["stat-big"]}>
        Overall Score: {score() < 0 ? "N/A" : Math.round(score() * 10) / 10}
      </div>
    );
  };

  const score = () => {
    let wpmScore = Math.min(1.5, 30 / Math.abs(140 - props.wpm));
    let varianceScore = wpmScore;
    if (wpmScore === 0 || !props.variance || props.variance < 0) {
      return -1;
    }
    varianceScore = Math.min(3.5, 50 / Math.sqrt(props.variance));
    return wpmScore + varianceScore;
  };

  return (
    <div className={styles["history-item-wrapper"]}>
      <div className={styles["question"]}>
        <img src={getImg()} alt="robot" />
        <h4>Question:</h4>
        <div>{props.question}</div>
      </div>
      <h4>Answer:</h4>
      <audio controls>
        <source src={props.audioSrc} type="audio/wav" />
      </audio>
      {renderWPM()}
      {renderVariance()}
      {renderScore()}
    </div>
  );
};

export default HistoryPage;
