import { useState } from "react";
import Menu from "./Menu";
import RecordPage from "./RecordPage";
import styles from "./App.module.css";

const App = () => {
  const [page, setPage] = useState("record");

  const renderPage = () => {
    if (page === "record") {
      return <RecordPage />;
    }
  };

  return (
    <div className={styles["wrapper"]}>
      <div style={{ flexGrow: 1, border: "1px solid #ff0000" }}>
        {renderPage()}
      </div>
      <Menu setPage={setPage} />
    </div>
  );
};

export default App;
