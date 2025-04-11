import { RegisterOptions, useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import styles from "./Input.module.scss";
import InputMask from "react-input-mask";

interface IProps {
  label?: string;
  placeholder: string;
  name: string;
  className?: string;
  isRequired: boolean;
  pattern?: RegExp;
  titleClassName?: string;
  wrapperClassName?: string;
  isPassword?: boolean;
  defaultValue?: string | number | null | undefined;
  isDisable?: boolean;
  value?: string;
	mask?: string;
  validation?: RegisterOptions;
}

const Input = (props: IProps) => {
  const {
    label,
    placeholder,
    name,
    isRequired,
    pattern = /^.*$/,
    titleClassName,
    wrapperClassName,
    className,
    isPassword = false,
    defaultValue,
    isDisable = false,
  } = props;
  const { register, formState, getFieldState } = useFormContext();
  const { errors } = formState;
  const inputStyles = {
    border: getFieldState(name).invalid
      ? "1px solid var(--ff-0000-button-red, #F00)"
      : "",
  };
  return (
    <div style={{ position: "relative" }}>
      <div className={`${styles.input} ${wrapperClassName}`}>
        {label ? (
          <p className={`${styles.title} ${titleClassName}`}>{label}</p>
        ) : null}
        <input
          {...register(name, {
            required: {
              value: isRequired,
              message: "Обязательное поле",
            },
            pattern: {
              // value: /[A-Za-z0-9]/,
              value: pattern,
              message: "Неверный формат ввода",
            },
          })}
          placeholder={placeholder}
          key={name}
          id={name}
          className={styles.field + " " + className}
          autoComplete="off"
          type={isPassword ? "password" : "text"}
          defaultValue={defaultValue as string}
          disabled={isDisable}
          style={inputStyles}
        />
      </div>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <p className={styles.error}>{message}</p>}
      />
    </div>
  );
};
export const DateInput = (props: IProps) => {
  const { register, formState: { errors } } = useFormContext();
  const {
    label,
    name,
    isRequired,
    titleClassName,
    wrapperClassName,
    // placeholder,
    defaultValue,
  } = props;
  return (
    <div style={{ position: "relative" }}>
      <div className={`${styles.input_data} ${wrapperClassName}`}>
        {label ? (
          <p className={`${styles.title} ${titleClassName}`}>{label}</p>
        ) : null}
        <InputMask
          mask={"99.99.9999"}
          className={`${styles.field} ${wrapperClassName}`}
          style={{
            height: "32px",
            width: "100px",
            padding: "8px 10px",
            fontSize: "13px",
          }}
          placeholder={'dd.mm.yyyy'}
          maskPlaceholder={null}
          defaultValue={defaultValue as string}
          {...register(name, {
            required: {
              value: isRequired,
              message: "Обязательное поле",
            },
            pattern: {
              // eslint-disable-next-line no-useless-backreference
              value: /^(?:(?:31([-.])(0[13578]|1[02])\1|(?:29|30)([-.])(0[13-9]|1[0-2])\3|(?:0[1-9]|1\d|2[0-8])([-.])(0[1-9]|1[0-2])\5)(\d{4})|29([-.])02\7(?:(\d{2}(?:[02468][048]|[13579][26])00)|(\d{2}(?:[02468][048]|[13579][26]))))$/i,
              message: "Неверный формат даты",
            },
            validate: (value) => {
              if (value) {
                const [day, month, year] = value.split(".");
                const date = new Date(Number(year), Number(month) - 1, Number(day));
                const today = new Date();
                return (
                  date.toString() !== "Invalid Date" &&
                  date <= today ? true : "Введите корректную дату"
                );
              }
            },
          })}
        />
        <ErrorMessage
          errors={errors}
          name={name}
          
          render={({ message }) => <p style={{ width: "max-content", left: 0, bottom: -16, position: "absolute"}} className={styles.error}>{message}</p>}
        />
      </div>
    </div>
  );
};

export const PhoneInput = (props: IProps) => {
  const {
    label,
    name,
    isRequired,
    titleClassName,
    wrapperClassName,
    pattern = /^.*$/,
    defaultValue,
		mask = "+1 (999) 999-99-99",
  } = props;
  const { register, formState, getFieldState } = useFormContext();
  const { errors } = formState;
  const inputStyles = {
    border: getFieldState(name).invalid
      ? "1px solid var(--ff-0000-button-red, #F00)"
      : "",
  };
  return (
    <div style={{ position: "relative" }}>
      <div className={`${styles.input_data} ${wrapperClassName}`}>
        {label ? (
          <p className={`${styles.title} ${titleClassName}`}>{label}</p>
        ) : null}
        <InputMask
          mask={mask}
          maskPlaceholder={null}
          className={styles.field}
          style={{
            height: "32px",
            ...inputStyles,
          }}
          placeholder="Номер телефона"
          defaultValue={defaultValue as string}
          {...register(name, {
            required: {
              value: isRequired,
              message: "Обязательное поле",
            },
            pattern: {
              value: pattern,
              message: "Неверный формат ввода",
            },
          })}
        />
      </div>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <p className={styles.error}>{message}</p>}
      />
    </div>
  );
};
export default Input;
