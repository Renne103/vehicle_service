import { Link } from "react-router-dom";
import Layout from "../../components/Layot";
import styles from "./HomePage.module.scss";
import Button from "../../components/Button/Button";
import { useEffect } from "react";
import { fetchCars } from "../../store/slices/carSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import CarCard from "../../components/CarCard/CarCard";

function HomePage() {
  const dispatch = useAppDispatch();
  const { cars } = useAppSelector((state) => state.cars);

  useEffect(() => {
    dispatch(fetchCars()); // Получаем список машин
  }, [dispatch]);

  return (
    <Layout>
      <div className={styles.header}>
        <p>Автомобили</p>
        <Link to="/add-car">
          <Button className={styles.button}>Добавить</Button>
        </Link>
      </div>
      <div className={styles.carlist}>
        {cars.map((car) => (
          <CarCard key={car.vin} car={car} />
        ))}
      </div>
    </Layout>
  );
}

export default HomePage;
