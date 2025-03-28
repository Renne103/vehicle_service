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
            raise ValueError("Password must be at least 8 characters long")
        return value
    
    @field_validator('tg')
    def validate_tg(cls, value: str) -> str:
        if len(value) < 5:
            raise ValueError("Telegram must be at least 5 characters long")
        return value
    
    @model_validator(mode="after")
    def validate_both_password(self) -> "RegisterSchema":
        if self.password != self.second_password:
            raise ValueError("Second password must be equal to password")
        return self


class RegisterResponseSchema(BaseModel):
    username: str
    
    model_config = ConfigDict(from_attributes=True)


class LoginResponseSchema(BaseModel):
    token: str

