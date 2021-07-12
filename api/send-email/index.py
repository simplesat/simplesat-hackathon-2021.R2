from fastapi import FastAPI

app = FastAPI()


@app.get("/api/{full_path:path}")
def send_email(request):
    print(request)
    return 'Success!'
