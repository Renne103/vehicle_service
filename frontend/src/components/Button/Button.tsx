import { ReactNode } from "react";
import styles from "./Button.module.scss";

function Button({
  children,
  type,
  onClick,
}: {
  children: ReactNode;
  type?: "submit" | "reset" | "button" | undefined;
  onClick?: () => void;
}) {
  return (
    <button className={styles.btn} type={type} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
