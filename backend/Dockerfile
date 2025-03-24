FROM python:3.12.7

RUN curl -sSL https://install.python-poetry.org | python -

ENV PATH="/root/.local/bin:$PATH" \
    POETRY_VERSION=2.1.1 \
    POETRY_VIRTUALENVS_CREATE=false \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH="/app/src:${PYTHONPATH}"

COPY ./src/poetry.lock ./src/pyproject.toml /app/src/

WORKDIR /app/src/

RUN poetry install --no-root

COPY ./src/vehicle/ /app/src/vehicle/

WORKDIR /app/src/vehicle/