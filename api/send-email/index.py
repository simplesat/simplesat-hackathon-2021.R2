import os
import datetime

import sendgrid
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from jinja2 import Environment, FileSystemLoader
from pydantic import BaseModel


app = FastAPI()


SENDGRID_API_KEY = os.getenv('api_key', '')


class EventTriggerPayload(BaseModel):
    id: str
    created_at: datetime.datetime
    trigger: dict
    table: dict
    event: dict


@app.post("/api/send-email/")
def send_email(event_trigger_payload: EventTriggerPayload):
    question = 'How would you rate your latest experience with Simplesat?'

    personalizations = []
    for receiver in event_trigger_payload.event['data']['new']['batch']:
        file_loader = FileSystemLoader('templates')
        env = Environment(loader=file_loader)
        template = env.get_template('email_template.html')
        content = template.render(
            question=question,
            survey_id=event_trigger_payload.event['data']['new']['survey_id'],
            ticket_id=event_trigger_payload.event['data']['new']['ticket_id']
        )

        sg = sendgrid.SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))
        data = {
            'personalizations': [
                {
                    'to': [
                        {
                            'email': receiver['email']
                        }
                    ],
                    'subject': question
                }
            ],
            'from': {
                'email': 'noreply@simplesat.io'
            },
            'content': [
                {
                    'type': 'text/html',
                    'value': content
                }
            ]
        }

        sg.client.mail.send.post(request_body=data)

    return HTMLResponse(status_code=200)
