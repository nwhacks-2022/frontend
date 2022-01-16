import React from "react";
import styles from "./Menu.module.css";

const Menu = (props) => {
  return (
    <div className={styles["wrapper"]}>
      <ul className={styles["menu-item"]}>
        <MenuItem
          selected={props.page === "interview"}
          page="interview"
          setPage={props.setPage}
          icon="comment"
          name="Interview"
        />
        <MenuItem
          selected={props.page === "questions"}
          page="questions"
          setPage={props.setPage}
          icon="clipboard"
          name="Questions"
        />
        <MenuItem
          selected={props.page === "history"}
          page="history"
          setPage={props.setPage}
          icon="tasks"
          name="Review"
        />
        {/* <MenuItem
          selected={props.page === "settings"}
          page="settings"
          setPage={props.setPage}
          icon="cog"
          name="Settings"
        /> */}
      </ul>
    </div>
  );
};

const MenuItem = (props) => {
  return (
    <li
      onClick={() => props.setPage(props.page)}
      className={props.selected ? styles["selected"] : null}
    >
      <div>
        <i className={`fas fa-${props.icon}`}></i>
      </div>
      <div>{props.name}</div>
    </li>
  );
};

export default Menu;
