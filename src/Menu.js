import React from "react";
import styles from "./Menu.module.css";

const Menu = (props) => {
  return (
    <div className={styles["wrapper"]}>
      <ul className={styles["menu-item"]}>
        <MenuItem
          page="record"
          setPage={props.setPage}
          icon="comment"
          name="Interview"
        />
        <MenuItem
          page="questions"
          setPage={props.setPage}
          icon="clipboard"
          name="Questions"
        />
        <MenuItem
          page="recordings"
          setPage={props.setPage}
          icon="microphone"
          name="Recordings"
        />
        <MenuItem
          page="settings"
          setPage={props.setPage}
          icon="cog"
          name="Settings"
        />
      </ul>
    </div>
  );
};

const MenuItem = (props) => {
  return (
    <li onClick={() => props.setPage(props.page)}>
      <div>
        <i className={`fas fa-${props.icon}`}></i>
      </div>
      <div>{props.name}</div>
    </li>
  );
};

export default Menu;
