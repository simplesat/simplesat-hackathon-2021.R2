from fastapi import FastAPI

app = FastAPI()


@app.get("/api/{full_path:path}")
def read_root():
    return 'Hello World!'
