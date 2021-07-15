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
    mutation insertAnswerMutation ($value: String, $survey_id: String, $ticket_id: String, $owned_by: String, $customer_id: String) {
        insert_answer(objects: {value: $value, survey_id: $survey_id, ticket_id: $ticket_id, owned_by: $owned_by, customer_id: $customer_id}) {
            affected_rows
        }
    }
    """
)


@app.post("/api/{full_path:path}")
def save_answer(event_trigger_payload: EventTriggerPayload):
    customer = get_or_create_customer(
        email=event_trigger_payload.event['data']['new']['email'],
        owned_by=event_trigger_payload.event['data']['new']['owned_by']
    )
    response = client.execute(
        insert_answer_mutation, variable_values={
            "value": event_trigger_payload.event['data']['new']['value'],
            "survey_id": event_trigger_payload.event['data']['new']['survey_id'],
            "ticket_id": event_trigger_payload.event['data']['new']['ticket_id'],
            "owned_by": event_trigger_payload.event['data']['new']['owned_by'],
            "customer_id": customer['id']
        }
    )
    if response['insert_answer']['affected_rows'] == 1:
        return HTMLResponse(status_code=204)

    return HTMLResponse(status_code=500)


get_customer_query = gql(
    """
    query getCustomer ($email: String,$owned_by: String) {
      usage(where: {email: {_eq: $email}, owned_by: {_eq: $owned_by}}) {
        id
      }
    }
    """
)
insert_cutomer_mutation = gql(
    """
    mutation insertCustomerMutation ($email: String, $owned_by: String) {
        insert_customer(objects: {email: $email, owned_by: $owned_by, name: ""}) {
            id
        }
    }
    """
)


def get_or_create_customer(email: str, owned_by: str):
    customer = client.execute(
        get_customer_query,
        variable_values={"email": email, "owned_by": owned_by}
    )
    is_customer_exist = len(customer['customer'])
    if is_customer_exist:
        return customer['customer'][0]
    else:
        response = client.execute(
            insert_cutomer_mutation,
            variable_values={"email": email, "owned_by": owned_by}
        )
        return response['insert_customer']['returning'][0]
