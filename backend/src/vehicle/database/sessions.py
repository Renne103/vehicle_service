from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from vehicle.configs.db_config import settings


engine = create_engine(url=settings.get_db_url)
sync_sessionmaker = sessionmaker(engine, expire_on_commit=False)


def get_session():
    with sync_sessionmaker() as session:
        yield session
