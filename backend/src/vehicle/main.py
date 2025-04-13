import uvicorn

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from vehicle.api.routers import all_routers
from vehicle.utils.exeptions import CustomValidationError, AuthorizationError


origins = [
    '*'
]


app = FastAPI(
    title="Vehicle Service",
    description="Vehicle Service API",
    version="0.0.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
def validation_exception_handler(request: Request, exc: RequestValidationError):
    exeption_data = exc.errors()
    exeption_out = []
    for exeption in exeption_data:
        location = exeption['loc'][-1]
        message = exeption['msg'].split(", ")[-1]
        exeption_out.append({
            'msg': message,
            'type': exeption['type'],
            'input': exeption.get('input'),
            'input_name': location
        })
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            'message': 'Ошибка валидации',
            'detail': exeption_out
        }
    )


@app.exception_handler(CustomValidationError)
def custom_validation_exception_handler(request: Request, exc: CustomValidationError):
    return JSONResponse(
        status_code=status.HTTP_406_NOT_ACCEPTABLE,
        content={
            "message": "Ошибка валидации",
            "detail": exc.errors
        }
    )


@app.exception_handler(AuthorizationError)
def authorization_exception_handler(request: Request, exc: AuthorizationError):
    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN,
        content={
            "message": "Ошибка авторизации",
            "detail": exc.detail
        }
    )


for router in all_routers:
    app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app="main:app", host="0.0.0.0", port=8000, reload=True)
