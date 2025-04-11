import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../store/slices/authSlice";
import { useForm } from "react-hook-form";
import Button from "../../components/Button/Button";

interface AuthFormData {
  username: string;
  password: string;
  secondPassword?: string;
  tg?: string;
}

function AuthPage() {
  const dispatch = useAppDispatch();
  const { error, token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AuthFormData>();

  const onSubmit = (data: AuthFormData) => {
    if (isRegister) {
      dispatch(
        registerUser({
          username: data.username,
          password: data.password,
          secondPassword: data.secondPassword,
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

  return (
    <div>
      <h2>{isRegister ? "Регистрация" : "Вход"}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("username", {
            required: "Имя пользователя обязательно",
          })}
          placeholder="Username"
        />
        {errors.username && <p>{errors.username.message}</p>}

        <input
          type="password"
          {...register("password", { required: "Пароль обязателен" })}
          placeholder="Password"
        />
        {errors.password && <p>{errors.password.message}</p>}

        {isRegister && (
          <>
            <input
              type="password"
              {...register("secondPassword", {
                required: "Повторите пароль",
                validate: (value) =>
                  value === watch("password") || "Пароли не совпадают",
              })}
              placeholder="Confirm Password"
            />
            {errors.secondPassword && <p>{errors.secondPassword.message}</p>}

            <input
              {...register("tg", {
                required: "Введите Telegram",
              })}
              placeholder="Telegram"
            />
          </>
        )}

        <Button type="submit">
          {isRegister ? "Зарегистрироваться" : "Войти"}
        </Button>
      </form>

      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister
          ? "Уже есть аккаунт? Войти"
          : "Нет аккаунта? Зарегистрироваться"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default AuthPage;
