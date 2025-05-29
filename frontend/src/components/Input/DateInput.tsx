"use client";

import { useFormContext, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Calendar } from "lucide-react";
import styles from "./DateInput.module.scss";

interface IProps {
  label?: string;
  placeholder: string;
  name: string;
  className?: string;
  isRequired: boolean;
  titleClassName?: string;
  wrapperClassName?: string;
  defaultValue?: string;
  isDisable?: boolean;
  validate?: (value: string) => any;
  minDate?: string;
  maxDate?: string;
}

const DateInput = (props: IProps) => {
  const {
    label,
    placeholder,
    name,
    isRequired,
    titleClassName,
    wrapperClassName,
    className,
    defaultValue,
    isDisable = false,
    validate,
    minDate,
    maxDate,
  } = props;

  const { control, formState, getFieldState } = useFormContext();
  const { errors } = formState;
  const isInvalid = getFieldState(name).invalid;

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.wrapper} ${wrapperClassName}`}>
        {label ? (
          <p className={`${styles.label} ${titleClassName}`}>{label}</p>
        ) : null}

        <div className={styles.inputContainer}>
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue || ""}
            rules={{
              required: {
                value: isRequired,
                message: "Обязательное поле",
              },
              validate,
            }}
            render={({ field: { onChange, value } }) => (
              <div className={styles.inputContainer}>
                <div
                  className={`${styles.displayValue}
                    ${value ? styles.value : styles.placeholder}`}
                >
                  {value ? formatDateForDisplay(value) : placeholder}
                </div>

                <input
                  type="date"
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value)}
                  min={minDate}
                  max={maxDate}
                  disabled={isDisable}
                  className={`${styles.input} ${
                    isInvalid && styles.error
                  } ${className}`}
                />

                <Calendar
                  className={`${styles.icon} ${isDisable && styles.disabled}`}
                />
              </div>
            )}
          />
        </div>
      </div>

      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <p className={styles.error}>{message}</p>}
      />
    </div>
  );
};

export default DateInput;
