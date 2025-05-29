FROM python:3.12.7 AS base

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

# =================== Стадия тестов ===================
FROM base AS test

COPY ./src/ /app/src/

WORKDIR /app/src/

CMD ["pytest", "tests", "-v", "--disable-warnings"]

# =================== Прод-стадия (основная) ===================
FROM base AS prod

COPY ./src/vehicle/ /app/src/vehicle/

WORKDIR /app/src/vehicle/
