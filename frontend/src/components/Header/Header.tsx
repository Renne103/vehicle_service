import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.scss";
import logo from "../../assets/logo.png";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <header className={styles.header}>
      <Modal
        isModalOpen={deleteOpen}
        btnClose={
          <Button
            type="button"
            className={styles.btn}
            onClick={() => setDeleteOpen(false)}
          >
            Закрыть
          </Button>
        }
        btnSubmit={<></>}
        closeHandler={() => setDeleteOpen(false)}
        modalClassname={styles.modal}
      >
        <>
          <p>112 - Единый номер службы спасения</p>
          <p>102 - Полиция / Дорожно-патрульная служба (ДПС ГИБДД)</p>
          <p>103 - Скорая медицинская помощь</p>
          <p>101 - Пожарная охрана / МЧС России</p>
          <p>
            Эвакуация автомобилей (при задержании за неправильную парковку):
          </p>
          <p>Единый телефон по вопросам эвакуации в Н.Новгороде:</p>
          <p>417-17-07 или 424-45-45.</p>
          <p>Частный эвакуатор Едем 52 </p>
          <p>8 (920) 253-07-87</p>
          <p>Аварийная газовая служба 104</p>
        </>
      </Modal>

      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="logo" />
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
          Уведомления
        </Link>
        <div className={`${styles.link}`} onClick={() => setDeleteOpen(true)}>
          Sos
        </div>
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
