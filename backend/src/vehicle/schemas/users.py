from pydantic import BaseModel, ConfigDict, field_validator, model_validator


class LoginSchema(BaseModel):
    username: str
    password: str
    
    model_config = ConfigDict(from_attributes=True)


class RegisterSchema(LoginSchema):
    second_password: str
    tg: str
    
    @field_validator('password')
    def validate_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Пароль должен быть больше 8 символов")
        return value
    
    @field_validator('tg')
    def validate_tg(cls, value: str) -> str:
        if len(value) < 5:
            raise ValueError("Телеграм должен быть больше 5 символов")
        return value
    
    @model_validator(mode="after")
    def validate_both_password(self) -> "RegisterSchema":
        if self.password != self.second_password:
            raise ValueError("Пароли должны совпадать")
        return self


class RegisterResponseSchema(BaseModel):
    username: str
    
    model_config = ConfigDict(from_attributes=True)


class LoginResponseSchema(BaseModel):
    token: str

