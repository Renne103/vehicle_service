import { RegisterOptions, useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import styles from "./Input.module.scss";

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
  validate?: (value: string | undefined) => any;
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
    validate,
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
            validate,
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

export default Input;
