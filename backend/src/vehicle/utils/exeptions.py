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