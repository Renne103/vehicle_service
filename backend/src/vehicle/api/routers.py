from .auth import router as register_router
from .cars import router as cars_router
from .files import router as files_router


all_routers = [
    register_router,
    cars_router,
    files_router
]