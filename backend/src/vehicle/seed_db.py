from datetime import date
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from vehicle.database.base import Base
from vehicle.models.users import User, TokenBlackList
from vehicle.models.cars import Cars
from vehicle.configs.db_config import settings

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
            password="hashedpassword1",
            first_name="John",
            last_name="Doe",
        )

        user2 = User(
            username="alice_smith",
            tg="@alice",
            password="hashedpassword2",
            first_name="Alice",
            last_name="Smith",
        )

        car1 = Cars(
            vin="1HGCM82633A004352",
            model="Civic",
            brand="Honda",
            user=user1,
            year_of_release=date(2015, 6, 1),
            mileage=78000,
            plate_license="ABC123",
            photo="car1.jpg"
        )

        car2 = Cars(
            vin="2C4RDGBG8ER123456",
            model="Grand Caravan",
            brand="Dodge",
            user=user2,
            year_of_release=date(2020, 4, 15),
            mileage=21000,
            plate_license="XYZ789",
            photo="car2.jpg"
        )

        session.add_all([user1, user2, car1, car2])
        session.commit()
        print("✅ Сидирование завершено")

if __name__ == "__main__":
    seed_data()