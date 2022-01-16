import React, { useState } from "react";
import Menu from "./Menu";
import InterviewPage from "./InterviewPage";
import QuestionsPage from "./QuestionsPage";
import HistoryPage from "./HistoryPage";
import styles from "./App.module.css";

const App = () => {
  const [page, setPage] = useState("interview");
  const [historyItemCount, setHistoryItemCount] = useState(-1);

  const viewHistory = (count) => {
    setHistoryItemCount(count);
    setPage("history");
  };

  const renderPage = () => {
    if (page === "interview") {
      return <InterviewPage viewHistory={viewHistory} />;
    }
    if (page === "questions") {
      return <QuestionsPage />;
    }
    if (page === "history") {
      return (
        <HistoryPage
          itemCount={historyItemCount}
          setItemCount={setHistoryItemCount}
        />
      );
    }
  };

  return (
    <div className={styles["wrapper"]}>
      <div style={{ flexGrow: 1 }}>{renderPage()}</div>
      <Menu page={page} setPage={setPage} />
    </div>
  );
};

export default App;
