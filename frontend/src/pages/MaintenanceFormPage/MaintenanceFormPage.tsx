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
    if (isEdit && current) reset(current);
  }, [isEdit, current, reset]);

  useEffect(() => {
    console.log(error);
    if (error) {
      error.forEach((err) =>
        setError(err.input_name as keyof Maintenance, { message: err.msg })
      );
    }
  }, [error, setError]);

  const onSubmit = async (data: Maintenance) => {
    try {
      if (isEdit && paramId)
        await dispatch(
          updateMaintenance({ id: Number(paramId), updates: data })
        ).unwrap();
      else await dispatch(addNewMaintenance(data)).unwrap();
      navigate(`/car/${data.car_vin}`);
    } catch {}
  };

  const onDelete = async () => {
    if (paramId) {
      await dispatch(
        deleteMaintenance({ id: Number(paramId), vin: paramVin! })
      ).unwrap();
      navigate(`/car/${paramVin}`);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Layout>
      <Modal
        isModalOpen={isOpen}
        btnClose={
          <Button type="button" onClick={() => setIsOpen(false)}>
            Отмена
          </Button>
        }
        btnSubmit={
          <Button type="button" onClick={onDelete}>
            Удалить
          </Button>
        }
        closeHandler={() => setIsOpen(false)}
        modalClassname={styles.modal}
      >
        <p className={styles.modalTitle}>Удалить обслуживание?</p>
      </Modal>

      <div className={styles.wrapper}>
        <h1 className={styles.header}>
          {isEdit ? "Редактировать обслуживание" : "Добавить обслуживание"}
        </h1>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <Input
              label="Дата"
              name="date"
              placeholder="Введите дату"
              isRequired
            />
            <Input
              label="Пробег"
              name="mileage"
              placeholder="Введите пробег"
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

            <div className={styles.btns}>
              {isEdit && (
                <Button type="button" onClick={() => setIsOpen(true)}>
                  Удалить
                </Button>
              )}
              <Button type="submit">{isEdit ? "Сохранить" : "Добавить"}</Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Layout>
  );
};

export default MaintenanceFormPage;
