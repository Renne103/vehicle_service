import { useRef, useState, ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { useAppDispatch } from "../../store/store";
import { uploadCarPhoto } from "../../store/slices/carSlice";
import styles from "./DocInput.module.scss";

type DocumentUploadProps = {
  name: string;
  label?: string;
  required?: boolean;
  accept?: string;
};

export default function DocInput({
  name,
  label = "Загрузить фото документа",
  required = false,
  accept = "image/*",
}: DocumentUploadProps) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [uploading, setUploading] = useState(false);

  const validateFile = (value: File | string | null) => {
    if (required && !value) {
      return "Файл обязателен";
    }
    return true;
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setValue(name, null);
      return;
    }

    setUploading(true);
    try {
      const { photo: path } = await dispatch(uploadCarPhoto(file)).unwrap();
      setValue(name, path, { shouldValidate: true, shouldDirty: true });
    } catch {
      setValue(name, null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Controller
        name={name}
        control={control}
        rules={{ validate: validateFile }}
        render={({ field: { value } }) => (
          <div className={styles.inputWrapper}>
            <input
              type="file"
              accept={accept}
              ref={fileInputRef}
              className={styles.hiddenInput}
              onChange={handleFileChange}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`${styles.uploadBox} ${value ? styles.filled : ""} ${
                uploading ? styles.uploading : ""
              }`}
            >
              {uploading ? (
                <span>Загрузка...</span>
              ) : value ? (
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>
                    {typeof value === "string" ? value.split("/").pop() : ""}
                  </span>
                </div>
              ) : (
                <div className={styles.placeholder}>
                  <Upload className={styles.uploadIcon} />
                  <span>{label}</span>
                </div>
              )}
            </div>

            {value && !uploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setValue(name, null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className={styles.deleteButton}
                aria-label="Удалить файл"
              >
                <X className={styles.deleteIcon} />
              </button>
            )}
          </div>
        )}
      />

      {errors[name] && (
        <p className={styles.errorMessage}>{errors[name]?.message as string}</p>
      )}
    </div>
  );
}
