import { useState } from "react";
import { Maintenance } from "../../store/slices/maintenanceSlice";
import styles from "./MaintenanceRow.module.scss";
import { AnimatePresence, motion } from "framer-motion";

const variants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1 },
};

function MaintenanceRow({ maintenance }: { maintenance: Maintenance }) {
  const [open, setOpen] = useState(false);
  const { category_of_work, cost, date, mileage, comments } = maintenance;
  return (
    <div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MaintenanceRow;
