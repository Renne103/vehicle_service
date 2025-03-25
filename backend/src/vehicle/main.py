import uvicorn

from fastapi import FastAPI

from vehicle.api.routers import all_routers


app = FastAPI(
    title="Vehicle Service",
    description="Vehicle Service API",
    version="0.0.1",
)

for router in all_routers:
    app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app="main:app", host="0.0.0.0", port=8000, reload=True)
