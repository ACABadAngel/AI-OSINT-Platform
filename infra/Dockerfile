FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:0.13.9 /uv /usr/local/bin/uv
WORKDIR /scope
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-dev
COPY apps/api/scope_api ./scope_api
COPY apps/worker/scope_worker ./scope_worker
ENV PATH="/scope/.venv/bin:$PATH"
RUN useradd --system --create-home scope
USER scope
