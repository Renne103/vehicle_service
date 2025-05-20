from vehicle.models.maintenances import MaintenanceCategory


PYDANTIC_VALIDATION_ERROR_TRANSLATIONS = {
    "greater_than_equal": "Значение должно быть больше или равно 0",
    "less_than_equal": "Значение должно быть меньше или равно 99999999",
    "enum": "Недопустимое значение работ",
    "date_from_datetime_inexact": "Некорректный формат даты",
}


class AuthorizationError(Exception):
    def __init__(self, errors: list[dict]):
        self.errors = errors

    @classmethod
    def single(
        cls,
        *,
        msg: str,
        input_name: str,
        type_: str = "authorization_error",
        input_value: str | None = None,
        ):
        return cls(errors=[{
            "msg": msg,
            "type": type_,
            "input": input_value,
            "input_name": input_name
        }])


class CustomValidationError(Exception):
    def __init__(self, errors: list[dict]):
        self.errors = errors

    @classmethod
    def single(
        cls,
        *,
        msg: str,
        input_name: str,
        type_: str = "value_error",
        input_value: str | None = None,
    ):
        return cls(errors=[{
            "msg": msg,
            "type": type_,
            "input": input_value,
            "input_name": input_name
        }])