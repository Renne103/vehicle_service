import { Link, useParams } from "react-router-dom";
import styles from "./Onboarding.module.scss";
import Button from "../../components/Button/Button";
import next from "../../assets/next.svg";

function Step({ type, step }: { type: "one" | "two" | "three"; step: number }) {
  let title = "",
    subtitle = "";
  switch (type) {
    case "one":
      title = " Вся необходимая информация о твоём авто в одном месте";
      subtitle = "VIN, год, марка и модель";
      break;
    case "two":
      title = "Отслеживай историю проделанных ремонтных работ";
      subtitle = "С прикреплением чеков и актов";
      break;
    case "three":
      title =
        "Получай персоанализированные уведомления  о замене запчастей и жидкостей";
      subtitle = "И будь спокоен за свой автомобиль!";
      break;
  }

  return (
    <div className={styles.page}>
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${step === 1 && styles.tab_active}`}
        ></div>
        <div
          className={`${styles.tab} ${step === 2 && styles.tab_active}`}
        ></div>
        <div
          className={`${styles.tab} ${step === 3 && styles.tab_active}`}
        ></div>
      </div>
      <div className={styles.wrapper}>
        <p className={styles.title}>{title}</p>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <div className={styles.skip_wrapper}>
        {step === 3 ? (
          <Link to={"/auth"} className={styles.submit}>
            <Button>Погнали!</Button>
          </Link>
        ) : (
          <>
            <p className={styles.subtitle} style={{ color: "#000000" }}>
              Пропустить
            </p>
            <Link
              style={{ background: "none", border: "none" }}
              to={`/onboarding/${step + 1}`}
            >
              <img src={next} alt="skip" className={styles.skip_icon} />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function OnboardingPage() {
  const { step } = useParams();
  switch (step) {
    case "1":
      return (
        <div className={styles.container}>
          <Step type="one" step={1} />
        </div>
      );
    case "2":
      return (
        <div className={styles.container}>
          <Step type="two" step={2} />
        </div>
      );
    case "3":
      return (
        <div className={styles.container}>
          <Step type="three" step={3} />
        </div>
      );
    default:
      return <div>404</div>;
  }
}

export default OnboardingPage;
