import { Controller, useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Select from "react-select";
import "./SelectInput.scss";

export interface ISelectItem {
  value: string;
  label: string;
}

interface SelectInputProps {
  name: string;
  label?: string;
  items: ISelectItem[];
  placeholder?: string;
  isRequired?: boolean;
  defaultValue?: ISelectItem | ISelectItem[] | null;
  isMulti?: boolean;
  isSearchable?: boolean;
}

const SelectInput = ({
  name,
  label,
  items,
  placeholder = "",
  isRequired = false,
  defaultValue = null,
  isMulti = false,
  isSearchable = false,
}: SelectInputProps) => {
  const { control, formState, getFieldState } = useFormContext();
  const { errors } = formState;
  const fieldState = getFieldState(name);

  return (
    <div className="select-input__wrapper">
      {label && (
        <p
          style={{
            color: fieldState.invalid ? "#FF0000" : "#959796",
            fontSize: "15px",
            fontWeight: 300,
          }}
        >
          {label}
        </p>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{
          required: isRequired ? "Обязательное поле" : false,
        }}
        render={({ field }) => (
          <Select
            {...field}
            options={items}
            isMulti={isMulti}
            isSearchable={isSearchable}
            placeholder={placeholder || label}
            className={fieldState.invalid ? "select_invalid" : ""}
            classNamePrefix="selectInput"
          />
        )}
      />

      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <p className="select-input__error">{message}</p>
        )}
      />
    </div>
  );
};

export default SelectInput;
