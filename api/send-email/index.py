import datetime
from fastapi import FastAPI
from pydantic import BaseModel


class EventTriggerPayload(BaseModel):
    id: str
    created_at: datetime.datetime
    trigger: dict
    table: dict
    event: dict


app = FastAPI()


@app.post("/api/{full_path:path}")
def send_email(event_trigger_payload: EventTriggerPayload):
    print('################ Sending email function Running #################')
    print(event_trigger_payload)
    return 'Success!'
