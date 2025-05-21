import { useState } from "react";
import {
  Maintenance,
  deleteMaintenance,
} from "../../store/slices/maintenanceSlice";
import styles from "./MaintenanceRow.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../Button/Button";
import { Link } from "react-router-dom";
import Modal from "../Modal/Modal";
import { useAppDispatch } from "../../store/store";

const variants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1 },
};

function MaintenanceRow({ maintenance }: { maintenance: Maintenance }) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const {
    category_of_work,
    cost,
    date,
    mileage,
    comments,
    id,
    car_vin,
    act_of_completed_works,
    receipt,
    warranty_card,
  } = maintenance;
  const dispatch = useAppDispatch();

  const onDelete = async () => {
    if (id) {
      await dispatch(
        deleteMaintenance({ id: Number(id), vin: car_vin! })
      ).unwrap();
    }
  };

  const renderLink = (url?: string, label?: string) => {
    if (!url) return null;
    const fileName = url.split("/").pop()!;
    return (
      <p className={styles.text}>
        <span>{label}:</span>{" "}
        <a href={url} download className={styles.docLink} target="_blank">
          скачать
        </a>
      </p>
    );
  };

  return (
    <div>
      <Modal
        isModalOpen={deleteOpen}
        btnClose={
          <Button
            type="button"
            className={styles.btn}
            onClick={() => setDeleteOpen(false)}
          >
            Отмена
          </Button>
        }
        btnSubmit={
          <Button type="button" onClick={onDelete} className={styles.btn}>
            Удалить
          </Button>
        }
        closeHandler={() => setDeleteOpen(false)}
        modalClassname={styles.modal}
      >
        <p className={styles.modalTitle}>Удалить обслуживание?</p>
      </Modal>

      <div className={styles.row} onClick={() => setOpen((o) => !o)}>
        <p className={styles.text}>{category_of_work}</p>
        <p className={styles.text}>{cost} ₽</p>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={variants}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
            className={styles.expanded}
          >
            <p className={styles.text}>
              <span>Дата обслуживания:</span> {date}
            </p>
            <p className={styles.text}>
              <span>Пробег:</span> {mileage} км
            </p>
            <p className={styles.text}>
              <span>Комментарий:</span> {comments || "—"}
            </p>

            {renderLink(act_of_completed_works, "Акт выполненных работ")}
            {renderLink(receipt, "Чек")}
            {renderLink(warranty_card, "Гарантийная карта")}

            <div className={styles.btns}>
              <Button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className={styles.btn}
              >
                Удалить
              </Button>
              <Link to={`edit-maintenance/${maintenance.id}`}>
                <Button className={styles.btn}>Редактировать</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MaintenanceRow;
