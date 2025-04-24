import { Car } from "../../store/slices/carSlice";
import styles from "./CarCard.module.scss";

function CarCard({ car }: { car: Car }) {
  const { vin, model, brand, year_of_release, mileage, plate_license, photo } =
    car;
  return (
    <div className={styles.card}>
      <div>
        <p className={styles.model}>Автомобиль {model}</p>
        <div className={styles.text_wrapper}>
          <p>
            <span>VIN:</span> {vin}
          </p>
          <p>
            <span>Год выпуска:</span> {year_of_release}
          </p>
          <p>
            <span>Марка:</span> {brand}
          </p>
          <p>
            <span>Пробег:</span> {mileage}
          </p>
          <p>
            <span>Гос. номер:</span> {plate_license}
          </p>
        </div>
      </div>
      <img src="" alt="" className={styles.img} />
    </div>
  );
}

export default CarCard;
