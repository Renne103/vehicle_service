import { ReactNode } from "react";
import styles from "./Button.module.scss";

function Button({
  children,
  type,
  onClick,
  className,
}: {
  children: ReactNode;
  type?: "submit" | "reset" | "button" | undefined;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      className={`${styles.btn} ${className}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
