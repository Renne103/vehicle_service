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
          to="/section-2"
          className={`${styles.link} ${
            location.pathname === "/section-2" ? styles.active : ""
          }`}
        >
          Раздел 2
        </Link>
        <Link
          to="/section-3"
          className={`${styles.link} ${
            location.pathname === "/section-3" ? styles.active : ""
          }`}
        >
          Раздел 3
        </Link>
      </nav>
    </header>
  );
};

export default Header;
