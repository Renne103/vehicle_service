import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.scss";

const Header = () => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          Лого
        </Link>
      </div>
      <nav className={styles.right}>
        <Link
          to="/"
          className={`${styles.link} ${
            location.pathname === "/" ? styles.active : ""
          }`}
        >
          Главная
        </Link>
        <Link
          to="https://t.me/vehicle_service_97_bot?start=true"
          target="_blank"
          className={`${styles.link}`}
        >
          Получить ссылку на бота
        </Link>
        <div
          className={`${styles.link}`}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Выход
        </div>
      </nav>
    </header>
  );
};

export default Header;
