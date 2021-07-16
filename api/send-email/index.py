import datetime
import os

import sendgrid
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from jinja2 import Environment, FileSystemLoader
from pydantic import BaseModel
from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport

app = FastAPI()


hasura_admin_secret = os.getenv("HASURA_ADMIN_SECRET", "")
simplesat_secret_token = os.getenv("SIMPLESAT_SECRET_TOKEN", "")
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY', '')

headers = {
    'content-type': 'application/json',
    'x-hasura-admin-secret': hasura_admin_secret
}
transport = AIOHTTPTransport(url=hasura_graphql_server, headers=headers)
client = Client(transport=transport, fetch_schema_from_transport=True)

get_customer_query = gql(
    """
    query getCustomer($email: String) {
        customer(where: {email: {_eq: $email}})  {
            email
            id
            owned_by
        }
    }
    """
)

class EventTriggerPayload(BaseModel):
    id: str
    created_at: datetime.datetime
    trigger: dict
    table: dict
    event: dict


@app.middleware('http')
async def validate_incoming_request(request: Request, call_next):
    if request.headers['X-Simplesat-Secret'] == simplesat_secret_token:
        response = await call_next(request)
        return response
    else:
        return HTMLResponse(status_code=401)


@app.post("/api/{full_path:path}")
def send_email(event_trigger_payload: EventTriggerPayload):
    question = 'How would you rate your latest experience with Simplesat?'

    personalizations = []
    for receiver in event_trigger_payload.event['data']['new']['batch']:
        customer = client.execute(
            get_customer_query, variable_values={
                "email": receiver['email']
            }
        )
        customer = customer['customer'] 

        file_loader = FileSystemLoader('api/send-email/templates')
        env = Environment(loader=file_loader)
        template = env.get_template('email_template.html')
        content = template.render(
            question=question,
            survey_id=event_trigger_payload.event['data']['new']['survey_id'],
            ticket_id=receiver['ticket_id'],
            customer_id=customer[0]['email'] if len(customer) > 0 else ''
            owned_by=customer[0]['owned_by'] if len(customer) > 0 else 'com_1000'
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
