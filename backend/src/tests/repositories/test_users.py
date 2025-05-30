import pytest
from unittest.mock import MagicMock
from vehicle.repositories.users import UserRepository
from vehicle.schemas.users import RegisterSchema
from vehicle.models.users import User, TokenBlackList


@pytest.fixture
def mock_session():
    return MagicMock()


def test_create_user_success(mock_session):
    repo = UserRepository(mock_session)
    data = RegisterSchema(username="john", password="cqyVu39gbdcgwedf", second_password="cqyVu39gbdcgwedf", tg="123456")

    result = repo.create_user(data)

    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once()
    assert result == "john"


def test_check_username_exists_true(mock_session):
    mock_session.execute.return_value.scalar_one_or_none.return_value = 1
    repo = UserRepository(mock_session)

    assert repo.check_username_exists("john") is True


def test_check_username_exists_false(mock_session):
    mock_session.execute.return_value.scalar_one_or_none.return_value = None
    repo = UserRepository(mock_session)

    assert repo.check_username_exists("john") is False


def test_check_tg_exists_true(mock_session):
    mock_session.execute.return_value.scalar_one_or_none.return_value = 1
    repo = UserRepository(mock_session)

    assert repo.check_tg_exists("123456") is True


def test_check_tg_exists_false(mock_session):
    mock_session.execute.return_value.scalar_one_or_none.return_value = None
    repo = UserRepository(mock_session)

    assert repo.check_tg_exists("123456") is False


def test_get_username_and_password(mock_session):
    mock_session.execute.return_value.first.return_value = ("john", "cqyVu39gbdcgwedf")
    repo = UserRepository(mock_session)

    result = repo.get_username_and_password("john")
    assert result == ("john", "cqyVu39gbdcgwedf")


def test_exists_token_true(mock_session):
    mock_session.execute.return_value.scalar.return_value = True
    repo = UserRepository(mock_session)

    assert repo.exists_token("some-token") is True


def test_exists_token_false(mock_session):
    mock_session.execute.return_value.scalar.return_value = False
    repo = UserRepository(mock_session)

    assert repo.exists_token("some-token") is False


def test_add_token_into_blacklist_success(mock_session):
    repo = UserRepository(mock_session)

    repo.add_token_into_blacklist("some-token")

    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()


def test_add_token_into_blacklist_failure(mock_session):
    mock_session.commit.side_effect = Exception("blacklist error")
    repo = UserRepository(mock_session)

    with pytest.raises(Exception, match="blacklist error"):
        repo.add_token_into_blacklist("some-token")

    mock_session.rollback.assert_called_once()


def test_get_user_id_from_username_exists(mock_session):
    mock_session.execute.return_value.scalar_one_or_none.return_value = 42
    repo = UserRepository(mock_session)

    assert repo.get_user_id_from_username("john") == 42


def test_get_user_id_from_username_not_exists(mock_session):
    mock_session.execute.return_value.scalar_one_or_none.return_value = None
    repo = UserRepository(mock_session)

    assert repo.get_user_id_from_username("john") is None
