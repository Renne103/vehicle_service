from pydantic import BaseModel
from typing import Any, List, Optional


class ErrorDetailSchema(BaseModel):
    msg: str
    input_name: Optional[str] = None
    input: Optional[Any] = None
    type: Optional[str] = None


class ValidationOrAuthorizationErrorResponse(BaseModel):
    message: str
    detail: List[ErrorDetailSchema]


class TokenErrorResponse(BaseModel):
    msg: str
    input_name: str