import os
import datetime

from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

hasura_admin_secret = os.getenv("HASURA_ADMIN_SECRET", "")
hasura_graphql_server = os.getenv("HASURA_GRAPHQL_SERVER", "")
hasura_graphql_server_ip = os.getenv("HASURA_GRAPHQL_SERVER_IP", "")
simplesat_secret_token = os.getenv("SIMPLESAT_SECRET_TOKEN", "")

app = FastAPI()

headers = {
    'content-type': 'application/json',
    'x-hasura-admin-secret': hasura_admin_secret
}
transport = AIOHTTPTransport(url=hasura_graphql_server, headers=headers)
client = Client(transport=transport, fetch_schema_from_transport=True)


@app.middleware("http")
async def validate_incoming_request(request: Request, call_next):
    if request.headers['X-Simplesat-Secret'] == simplesat_secret_token:
        response = await call_next(request)
        return response
    else:
        return HTMLResponse(status_code=401)


class EventTriggerPayload(BaseModel):
    id: str
    created_at: datetime.datetime
    trigger: dict
    table: dict
    event: dict


insert_answer_mutation = gql(
    """
    mutation insertAnswerMutation ($value: Int, $survey_id: String, $ticket_id: String, $owned_by: String, $customer_id: String) {
        insert_answer(objects: {value: $value, survey_id: $survey_id, ticket_id: $ticket_id, owned_by: $owned_by, customer_id: $customer_id}) {
            affected_rows
        }
    }
    """
)


@app.post("/api/{full_path:path}")
def save_answer(event_trigger_payload: EventTriggerPayload):
    response = client.execute(
        insert_answer_mutation, variable_values={
            "value": event_trigger_payload.event['data']['new']['feedback_value'],
            "customer_id": event_trigger_payload.event['data']['new']['customer_id'],
            "survey_id": event_trigger_payload.event['data']['new']['survey_id'],
            "ticket_id": event_trigger_payload.event['data']['new']['ticket_id'],
            "owned_by": event_trigger_payload.event['data']['new']['owned_by'],
        }
    )
    if response['insert_answer']['affected_rows'] == 1:
        return HTMLResponse(status_code=204)

    return HTMLResponse(status_code=500)
