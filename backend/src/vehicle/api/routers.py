from .auth import router as register_router
from .cars import router as cars_router


all_routers = [
    register_router,
    cars_router
]