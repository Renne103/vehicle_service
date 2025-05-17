import { JSX, useCallback, useEffect, useRef } from "react";
import styles from "./Modal.module.scss";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  isModalOpen: boolean;
  closeHandler: () => void;
  children: JSX.Element;
  modalClassname?: string;
  btnClose?: JSX.Element;
  btnSubmit?: JSX.Element;
  btnsClassname?: string;
}

function Modal(props: Props) {
  const {
    isModalOpen,
    closeHandler,
    children,
    modalClassname,
    btnClose,
    btnSubmit,
    btnsClassname,
  } = props;
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (event: Event) => {
      if (overlayRef.current === event.target) {
        closeHandler();
      }
    },
    [closeHandler]
  );
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  });

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [handleClick]);

  return (
    <AnimatePresence>
      {isModalOpen ? (
        <motion.div
          className={styles.overlay}
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`${styles.modal} ${modalClassname}`}>
            {children}
            {btnClose ? (
              <div className={`${styles.btns} ${btnsClassname}`}>
                {btnClose}
                {btnSubmit}
              </div>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default Modal;
