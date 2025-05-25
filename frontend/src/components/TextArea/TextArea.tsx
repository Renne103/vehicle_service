import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import styles from "./TextArea.module.scss";

interface TextareaProps {
  label?: string;
  placeholder: string;
  name: string;
  className?: string;
  isRequired?: boolean;
  pattern?: RegExp;
  titleClassName?: string;
  wrapperClassName?: string;
  defaultValue?: string;
  isDisable?: boolean;
  validate?: (value: string | undefined) => any;
  rows?: number;
}

const Textarea = (props: TextareaProps) => {
  const {
    label,
    placeholder,
    name,
    isRequired = false,
    pattern = /^.*$/,
    titleClassName,
    wrapperClassName,
    className,
    defaultValue,
    isDisable = false,
    validate,
    rows = 4,
  } = props;

  const { register, formState, getFieldState } = useFormContext();
  const { errors } = formState;

  const fieldState = getFieldState(name);
  const borderStyle = fieldState.invalid
    ? "1px solid var(--ff-0000-button-red, #F00)"
    : undefined;

  return (
    <div style={{ position: "relative" }}>
      <div className={`${styles.textareaWrapper} ${wrapperClassName}`}>
        {label && (
          <p className={`${styles.title} ${titleClassName}`}>{label}</p>
        )}
        <textarea
          {...register(name, {
            required: isRequired ? "Обязательное поле" : false,
            pattern: {
              value: pattern,
              message: "Неверный формат ввода",
            },
            validate,
          })}
          placeholder={placeholder}
          id={name}
          className={`${styles.field} ${className}`}
          defaultValue={defaultValue}
          disabled={isDisable}
          rows={rows}
          style={{ border: borderStyle }}
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

export default Textarea;
