import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  addNewMaintenance,
  fetchMaintenanceById,
  CategoryOfWork,
  Maintenance,
  updateMaintenance,
  deleteMaintenance,
} from "../../store/slices/maintenanceSlice";
import styles from "./MaintenanceFormPage.module.scss";
import Layout from "../../components/Layot";
import Textarea from "../../components/TextArea/TextArea";
import SelectInput from "../../components/SelectInput/SelectInput";
import DocInput from "../../components/DocInput/DocInput";
import DateInput from "../../components/Input/DateInput";

const MaintenanceFormPage = () => {
  const { vin: paramVin, id: paramId } = useParams<{
    vin?: string;
    id?: string;
  }>();
  const isEdit = Boolean(paramId);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const methods = useForm<Maintenance>({
    defaultValues: { car_vin: paramVin || "" },
  });
  const { handleSubmit, setError, reset } = methods;

  const error = useAppSelector((state) => state.maintenances.error);
  const current = useAppSelector((state) => state.maintenances.current);

  useEffect(() => {
    if (isEdit && paramId) dispatch(fetchMaintenanceById(Number(paramId)));
  }, [isEdit, paramId, dispatch]);

  useEffect(() => {
    if (isEdit && current)
      // @ts-expect-error
      reset({
        ...current,
        category_of_work: {
          label: current.category_of_work,
          value: current.category_of_work,
        },
      });
  }, [isEdit, current, reset]);

  useEffect(() => {
    if (error) {
      error.forEach((err) =>
        setError(err.input_name as keyof Maintenance, { message: err.msg })
      );
    }
  }, [error, setError]);

  const onSubmit = async (data: Maintenance) => {
    try {
      const payload = {
        ...data,
        // @ts-ignore
        category_of_work: data.category_of_work.value,
        car_vin: paramVin!,
      };
      if (isEdit && paramId) {
        await dispatch(
          updateMaintenance({ id: Number(paramId), updates: payload })
        ).unwrap();
      } else {
        await dispatch(addNewMaintenance(payload)).unwrap();
      }
      navigate(`/car/${data.car_vin}`);
    } catch {}
  };

  return (
    <Layout>
      <div className={styles.wrapper}>
        <Button
          type="button"
          onClick={() => navigate(-1)}
          className={styles.back_btn}
        >
          Назад
        </Button>
        <h1 className={styles.header}>
          {isEdit ? "Редактировать обслуживание" : "Добавить обслуживание"}
        </h1>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {/* <Input
              label="Дата"
              name="date"
              placeholder="ДД-ММ-ГГГГ"
              isRequired
            /> */}
            <DateInput placeholder="Дата" name="date" isRequired={true} />
            <Input
              label="Пробег"
              name="mileage"
              placeholder="Введите текущий пробег в км"
              isRequired
            />
            <Input
              label="Стоимость"
              name="cost"
              placeholder="Введите стоимость"
              isRequired
            />
            <Textarea
              label="Комментарии"
              name="comments"
              placeholder="Введите комментарии"
              isRequired={false}
            />
            <SelectInput
              label="Категория обслуживания"
              name="category_of_work"
              items={Object.values(CategoryOfWork).map((item) => ({
                label: item,
                value: item,
              }))}
              isRequired
            />
            <DocInput
              name="act_of_completed_works"
              label="Фото акта принятия работ"
            />
            <DocInput name="receipt" label="Фото чека" />
            <DocInput name="warranty_card" label="Фото гарантийного талона" />
            <div className={styles.btns}>
              <Button type="submit">{isEdit ? "Сохранить" : "Добавить"}</Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Layout>
  );
};

export default MaintenanceFormPage;
