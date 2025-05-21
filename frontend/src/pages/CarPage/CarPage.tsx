import { Link, useParams } from "react-router-dom";
import styles from "./CarPage.module.scss";
import Layout from "../../components/Layot";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
import { Car, getCarByVin } from "../../store/slices/carSlice";
import Button from "../../components/Button/Button";
import { fetchMaintenances } from "../../store/slices/maintenanceSlice";
import MaintenanceRow from "../../components/MaintenanceRow/MaintenanceRow";

function CarPage() {
  const { vin } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const car = useSelector((state: RootState) =>
    state.cars.cars.find((c) => c.vin === vin)
  );
  const maintenances = useSelector(
    (state: RootState) => state.maintenances.list
  );
  const { photo, mileage, model, year_of_release, brand, plate_license } =
    car || {};
  const error = useSelector((state: RootState) => state.cars.error);

  useEffect(() => {
    console.log("vin", vin);
    if (vin) {
      dispatch(getCarByVin(vin));
      dispatch(fetchMaintenances(vin));
    }
  }, [vin, dispatch]);

  return (
    <Layout>
      <div className={styles.wrapper}>
        <div className={styles.info}>
          {photo ? (
            <img src={photo} alt="photo" className={styles.img} />
          ) : (
            <div className={styles.img}></div>
          )}
          <div>
            <div className={styles.info__title}>
              <p className={styles.model}>Автомобиль {model}</p>
              <Link to={`/edit-car/${vin}`}>
                <Button className={styles.button}>Редактировать</Button>
              </Link>
            </div>
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
        </div>

        <div className={styles.maintenance__wrapper}>
          <div className={styles.info__title}>
            <p className={styles.model}>Обслуживание</p>
            <Link to={`/add-maintenance`}>
              <Button className={styles.button}>Добавить</Button>
            </Link>
          </div>
          <div className={styles.maintenance__table}>
            {maintenances?.map((maintenance, index) => (
              <>
                <MaintenanceRow
                  key={maintenance.id}
                  maintenance={maintenance}
                />
                {index < maintenances.length - 1 && (
                  <div key={index} className={styles.maintenance__divider} />
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CarPage;
