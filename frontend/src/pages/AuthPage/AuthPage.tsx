import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../store/slices/authSlice";
import { FormProvider, useForm } from "react-hook-form";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import styles from "./AuthPage.module.scss";

interface AuthFormData {
  username: string;
  password: string;
  second_password?: string;
  tg?: string;
}

function AuthPage() {
  const dispatch = useAppDispatch();
  const { error, token, username } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);

  const methods = useForm<AuthFormData>();
  const { handleSubmit, reset, watch, setError } = methods;

  const onSubmit = (data: AuthFormData) => {
    if (isRegister) {
      dispatch(
        registerUser({
          username: data.username,
          password: data.password,
          second_password: data.second_password,
          tg: data.tg,
        })
      );
    } else {
      dispatch(loginUser({ username: data.username, password: data.password }));
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  useEffect(() => {
    reset(); // очищаем форму при смене режима
  }, [isRegister, reset]);

  useEffect(() => {
    error?.map((err) =>
      setError(err.input_name as keyof AuthFormData, { message: err.msg })
    );
  }, [error]);

  useEffect(() => {
    setIsRegister(false);
    reset();
  }, [username, navigate]);

  return (
    <div className={styles.page}>
      <p className={styles.title}>{isRegister ? "Регистрация" : "Вход"}</p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input placeholder="Username" name="username" isRequired={true} />
          <Input
            placeholder="Password"
            name="password"
            isRequired={true}
            isPassword
          />

          {isRegister && (
            <>
              <Input
                placeholder="Confirm Password"
                name="second_password"
                isRequired={true}
                isPassword
                validate={(value) =>
                  value === watch("password") || "Пароли не совпадают"
                }
              />
              <Input placeholder="Telegram" name="tg" isRequired={true} />
            </>
          )}
          <Button type="submit">
            {isRegister ? "Зарегистрироваться" : "Войти"}
          </Button>
          <p onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? (
              <>
                Уже есть аккаунт? <u>Войти</u>
              </>
            ) : (
              <>
                Нет аккаунта? <u>Зарегистрироваться</u>
              </>
            )}
          </p>
        </form>
      </FormProvider>
    </div>
  );
}

export default AuthPage;
