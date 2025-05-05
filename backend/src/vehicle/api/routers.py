from .auth import router as register_router
from .cars import router as cars_router
from .files import router as files_router
from .maintenances import router as maintenances_router


all_routers = [
    register_router,
    cars_router,
    files_router,
    maintenances_router
]