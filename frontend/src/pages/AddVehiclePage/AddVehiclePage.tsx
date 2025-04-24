import { FormProvider, useForm } from "react-hook-form";
import Layout from "../../components/Layot";
import { Car, addNewCar } from "../../store/slices/carSlice";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import styles from "./AddVehiclePage.module.scss";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { PhotoInput } from "../../components/PhotoInput/PhotoInput";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddVehiclePage = () => {
  const methods = useForm<Car>();
  const { handleSubmit, control, setError, reset } = methods;
  const { error } = useAppSelector((state) => state.cars);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    error?.map((err) =>
      setError(err.input_name as keyof Car, { message: err.msg })
    );
  }, [error]);

  const onSubmit = async (data: Car) => {
    try {
      const response = await dispatch(addNewCar(data)).unwrap();
      console.log("Машина добавлена:", response);
      reset();
      navigate("/");
    } catch (error) {
      console.error("Ошибка при добавлении автомобиля:", error);
    }
  };

  return (
    <Layout>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1>Добавить автомобиль</h1>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <PhotoInput name="photo" control={control} />

            <Input
              label="VIN"
              placeholder="Введите VIN"
              name="vin"
              isRequired={true}
            />

            <Input
              label="Модель"
              placeholder="Введите модель"
              name="model"
              isRequired={true}
            />

            <Input
              label="Марка"
              placeholder="Введите бренд"
              name="brand"
              isRequired={true}
            />

            <Input
              label="Пробег"
              placeholder="Введите пробег"
              name="mileage"
              isRequired={true}
            />

            <Input
              label="Год выпуска"
              placeholder="Введите год выпуска"
              name="year_of_release"
              isRequired={false}
            />

            <Input
              label="Номерной знак"
              placeholder="Введите номерной знак"
              name="plate_license"
              isRequired={false}
            />

            <Button type="submit">Добавить</Button>
          </form>
        </FormProvider>
      </div>
    </Layout>
  );
};

export default AddVehiclePage;
