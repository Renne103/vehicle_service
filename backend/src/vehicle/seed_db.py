from datetime import date
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from vehicle.database.base import Base
from vehicle.models.users import User, TokenBlackList
from vehicle.models.cars import Cars
from vehicle.configs.db_config import settings
from vehicle.utils.auth import get_hashed_password

DATABASE_URL = settings.get_db_url
engine = create_engine(DATABASE_URL, echo=True)

def seed_data():
    with Session(engine) as session:
        # 📌 Проверка: есть ли хотя бы один пользователь
        user_exists = session.execute(select(User).limit(1)).scalar()
        if user_exists:
            print("⚠️ Данные уже есть, пропускаем сидирование.")
            return

        print("🚀 Сидируем тестовые данные...")

        user1 = User(
            username="john_doe",
            tg="@john",
            password=get_hashed_password('hashedpassword1'),
            first_name="John",
            last_name="Doe",
        )

        user2 = User(
            username="alice_smith",
            tg="@alice",
            password=get_hashed_password("hashedpassword2"),
            first_name="Alice",
            last_name="Smith",
        )

        session.add_all([user1, user2])
        session.flush()  # Чтобы user1.id и user2.id были доступны

        cars = []
        for i in range(10):
            cars.append(Cars(
                vin=f"1HGCM82633A0{i:05}",
                model=f"Civic {i}",
                brand="Honda",
                user_id=user1.id,
                year_of_release=2010 + i % 10,
                mileage=50000 + i * 1000,
                plate_license=f"JD{i:03}",
            ))
            cars.append(Cars(
                vin=f"2C4RDGBG8ER1{i:05}",
                model=f"Caravan {i}",
                brand="Dodge",
                user_id=user2.id,
                year_of_release=2012 + i % 10,
                mileage=20000 + i * 1500,
                plate_license=f"AS{i:03}",
            ))

        session.add_all(cars)
        session.commit()
        print("✅ Сидирование завершено")

if __name__ == "__main__":
    seed_data()
