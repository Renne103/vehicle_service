import React, { useState } from "react";
import { useController, Control } from "react-hook-form";
import { X, Upload, Eye } from "lucide-react";
import { useAppDispatch } from "../../store/store"; // Подключаем dispatch
import { uploadCarPhoto } from "../../store/slices/carSlice"; // Импортируем uploadCarPhoto
import styles from "./PhotoInput.module.scss";

interface PhotoUploadProps {
  name: string;
  control: Control<any>;
  label?: string;
  uploadUrl?: string;
}

export const PhotoInput: React.FC<PhotoUploadProps> = ({
  name,
  control,
  label = "Фотография",
  uploadUrl = "/api/docs", // Указываем URL для загрузки фото
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const dispatch = useAppDispatch(); // Подключаем dispatch для отправки данных в Redux
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: "",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Создаем превью
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Загружаем фото на сервер через Redux слайс
    setIsUploading(true);
    try {
      // Делаем запрос на сервер через uploadCarPhoto
      const response = await dispatch(uploadCarPhoto(file)).unwrap();

      if (!response || !response.photo) {
        throw new Error("Ошибка загрузки");
      }

      // Сохраняем URL фото в форме
      onChange(response.photo);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(""); // Очищаем значение фото
  };

  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>

      {!preview ? (
        <div className={styles.uploadContainer}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <div className={styles.dropZone}>
            <Upload className={styles.uploadIcon} />
            <p className={styles.uploadText}>
              Нажмите или перетащите файл для загрузки
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.previewContainer}>
          <div className={styles.imageWrapper}>
            <img
              src={preview || "/placeholder.svg"}
              alt="Предпросмотр"
              className={styles.previewImage}
            />
            <div className={styles.actionButtons}>
              <button
                type="button"
                onClick={togglePreview}
                className={styles.actionButton}
              >
                <Eye size={16} />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className={styles.actionButton}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {isUploading && <div className={styles.uploadingText}>Загрузка...</div>}

      {error && <div className={styles.errorText}>{error.message}</div>}

      {/* Модальное окно для просмотра фото */}
      {isPreviewOpen && preview && (
        <div className={styles.modal} onClick={togglePreview}>
          <div className={styles.modalContent}>
            <img
              src={preview || "/placeholder.svg"}
              alt="Просмотр"
              className={styles.modalImage}
            />
          </div>
        </div>
      )}
    </div>
  );
};
