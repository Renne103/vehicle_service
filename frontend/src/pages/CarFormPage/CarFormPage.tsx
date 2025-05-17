import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { PhotoInput } from "../../components/PhotoInput/PhotoInput";
import {
  Car,
  addNewCar,
  deleteCar,
  getCarByVin,
  updateCar,
} from "../../store/slices/carSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import styles from "./CarFormPage.module.scss";
import Layout from "../../components/Layot";
import Modal from "../../components/Modal/Modal";

const CarFormPage = () => {
  const { vin: paramVin } = useParams<{ vin?: string }>();
  const isEdit = Boolean(paramVin);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const methods = useForm<Car>();
  const { handleSubmit, control, setError, reset } = methods;

  const error = useAppSelector((state) => state.cars.error);
  const current = useAppSelector((state) =>
    state.cars.cars.find((c) => c.vin === paramVin)
  );

  useEffect(() => {
    if (isEdit && paramVin) {
      dispatch(getCarByVin(paramVin));
    }
  }, [isEdit, paramVin, dispatch]);

  useEffect(() => {
    if (isEdit && current) {
      reset(current);
    }
  }, [isEdit, current, reset]);

  useEffect(() => {
    if (error) {
      error.forEach((err) =>
        setError(err.input_name as keyof Car, { message: err.msg })
      );
    }
  }, [error, setError]);

  const onSubmit = async (data: Car) => {
    try {
      if (isEdit && paramVin) {
        await dispatch(updateCar({ vin: paramVin, updates: data })).unwrap();
      } else {
        await dispatch(addNewCar(data)).unwrap();
      }
      navigate(`/car/${data.vin}`);
    } catch {
      //
    }
  };

  const onDelete = async () => {
    await dispatch(deleteCar(paramVin!)).unwrap();
    navigate("/");
  };

  const [isOpen, setIsOpen] = useState(false);

  const modal = (
    <Modal
      isModalOpen={isOpen}
      btnClose={
        <Button
          type="button"
          onClick={() => setIsOpen(false)}
          className={styles.button}
        >
          Отмена
        </Button>
      }
      btnSubmit={
        <Button type="button" onClick={onDelete} className={styles.button}>
          Удалить
        </Button>
      }
      closeHandler={() => setIsOpen(false)}
      modalClassname={styles.modal}
    >
      <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}>
        Удалить обслуживание?
      </p>
    </Modal>
  );

  return (
    <Layout>
      {modal}
      <div className={styles.wrapper}>
        <h1 className={styles.header}>
          {isEdit ? "Редактировать автомобиль" : "Добавить автомобиль"}
        </h1>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <PhotoInput name="photo" control={control} />
            {isEdit ? null : (
              <Input
                label="VIN"
                placeholder="Введите VIN"
                name="vin"
                isRequired
              />
            )}
            <Input
              label="Модель"
              placeholder="Введите модель"
              name="model"
              isRequired
            />
            <Input
              label="Марка"
              placeholder="Введите бренд"
              name="brand"
              isRequired
            />
            <Input
              label="Пробег"
              placeholder="Введите пробег"
              name="mileage"
              isRequired
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
            <div className={styles.btns}>
              {isEdit ? (
                <Button type="button" onClick={() => setIsOpen(true)}>
                  Удалить
                </Button>
              ) : null}
              <Button type="submit">{isEdit ? "Сохранить" : "Добавить"}</Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Layout>
  );
};

export default CarFormPage;
