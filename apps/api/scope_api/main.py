from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="SCOPE", version="0.0.0")


class Health(BaseModel):
    status: str


@app.get("/health/live", response_model=Health)
def live() -> Health:
    return Health(status="ok")
