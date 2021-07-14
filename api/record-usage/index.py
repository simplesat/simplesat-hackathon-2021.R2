import os
import datetime

from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

hasura_admin_secret = os.getenv("HASURA_ADMIN_SECRET", "")
hasura_graphql_server = os.getenv("HASURA_GRAPHQL_SERVER", "")
hasura_graphql_server_ip = os.getenv("HASURA_GRAPHQL_SERVER_IP", "")

app = FastAPI()

headers = {
    'content-type': 'application/json',
    'x-hasura-admin-secret': hasura_admin_secret
}
transport = AIOHTTPTransport(url=hasura_graphql_server, headers=headers)
client = Client(transport=transport, fetch_schema_from_transport=True)

search_date_query = gql(
    """
    query getUsage ($date: date, $type: String, $owned_by: String) {
      usage(where: {date: {_eq: $date}, type: {_eq: $type}, owned_by: {_eq: $owned_by}}) {
        id
        date
        type
        count
        owned_by
      }
    }
    """
)
create_usage_mutation = gql(
    """
    mutation createUserMutation ($date: date, $type: String, $owned_by: String) {
        insert_usage(objects: {date: $date, type: $type, owned_by: $owned_by, count: 1}) {
            affected_rows
        }
    }
    """
)
increment_usage_mutation = gql(
    """
    mutation incrementUsageMutation ($date: date, $type: String, $owned_by: String) {
        update_usage(_inc: {count: 1}, where: {date: {_eq: $date}, type: {_eq: $type}, owned_by: {_eq: $owned_by}}){
            affected_rows
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


@app.post("/api/{full_path:path}")
def record_usage(event_trigger_payload: EventTriggerPayload):
    date = event_trigger_payload.created_at.strftime('%Y-%m-%d')
    owned_by = event_trigger_payload.event['data']['new']['owned_by']
    type = event_trigger_payload.trigger['name']\
        .replace('record_', '')\
        .replace('_usage', '')
    usage = client.execute(
        search_date_query, variable_values={
            "date": date, "type": type, "owned_by": owned_by}
    )
    is_usage_exist = len(usage['usage'])

    if is_usage_exist:
        return _increment_usage(date, owned_by, type)
    else:
        return _create_new_usage(date, owned_by, type)


def _create_new_usage(date: str, owned_by: str, type: str):
    response = client.execute(
        create_usage_mutation, variable_values={
            "date": date, "type": type, "owned_by": owned_by}
    )
    if response['insert_usage']['affected_rows'] == 1:
        return HTMLResponse(status_code=204)

    return HTMLResponse(status_code=500)


def _increment_usage(date: str, owned_by: str, type: str):
    response = client.execute(
        increment_usage_mutation, variable_values={
            "date": date, "type": type, "owned_by": owned_by}
    )
    if response['update_usage']['affected_rows'] == 1:
        return HTMLResponse(status_code=204)

    return HTMLResponse(status_code=500)
