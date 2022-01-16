import pageStyles from "./Page.module.css";
import styles from "./RecordPage.module.css";

const RecordPage = (props) => {
  return (
    <div className={pageStyles["wrapper"]}>
      <h2>Question</h2>
      <div className={styles["question-wrapper"]}>
        <div>
          <div>If you were an ocean animal, what would you be?</div>
        </div>
      </div>
      <div class="hr" />
      <div className={styles["time-elapsed"]}>00:00</div>
      <button className={styles["record-button"]}>Record Answer</button>
      <button className={styles["skip-button"]}>Skip Question</button>
    </div>
  );
};

export default RecordPage;
