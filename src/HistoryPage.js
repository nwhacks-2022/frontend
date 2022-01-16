import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./HistoryPage.module.css";
import pageStyles from "./Page.module.css";

import robotSadTearImg from "./image/robots/sadTear.png";
import robotBruhImg from "./image/robots/bruh.png";
import robotUghImg from "./image/robots/ugh.png";
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
    if (props.wpm < 100) {
      return robotUghImg;
    } else if (props.wpm < 130) {
      return robotSparkleImg;
    } else if (props.wpm <= 150) {
      return robotRainbowImg;
    } else if (props.wpm <= 200) {
      return robotSparkleImg;
    } else if (props.wpm <= 230) {
      return robotUghImg;
    } else {
      return robotBruhImg;
    }
  };
  return (
    <div className={styles["history-item-wrapper"]}>
      <div>
        <img src={getImg()} alt="robot" />
        <h4>Question:</h4>
        <div>{props.question}</div>
      </div>
      <h4>Answer:</h4>
      <audio controls>
        <source src={props.audioSrc} type="audio/wav" />
      </audio>
      <h1 className={styles["wpm"]}>{Math.round(props.wpm)} WPM</h1>
    </div>
  );
};

export default HistoryPage;
