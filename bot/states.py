from aiogram.fsm.state import StatesGroup, State

class CarMileageStates(StatesGroup):
    waiting_for_mileage = State()
