import os
import datetime

from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

hasura_admin_secret = os.getenv("HASURA_ADMIN_SECRET", "")
hasura_graphql_server = os.getenv("HASURA_GRAPHQL_SERVER", "")
hasura_graphql_server_ip = os.getenv("HASURA_GRAPHQL_SERVER_IP", "")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[hasura_graphql_server_ip],
)

headers = {
    'content-type': 'application/json',
    'x-hasura-admin-secret': hasura_admin_secret
}
transport = AIOHTTPTransport(url=hasura_graphql_server, headers=headers)
client = Client(transport=transport, fetch_schema_from_transport=True)

search_date_query = gql(
    """
    query getUsage ($date: date) {
      usage(where: {date: {_eq: $date}}) {
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


class EventTriggerPayload(BaseModel):
    id: str
    created_at: datetime.datetime
    trigger: dict
    table: dict
    event: dict


@app.post("/api/{full_path:path}")
def record_usage(event_trigger_payload: EventTriggerPayload):
    date = event_trigger_payload.created_at.strftime('%Y-%m-%d')
    print(date)
    owned_by = event_trigger_payload.event['data']['new']['owned_by']
    print(owned_by)
    response = client.execute(
        search_date_query, variable_values={"date": date})
    print('###################')
    print(response)
    print('###################')
    usage = response['usage']

    if usage:
        pass
    else:
        response = client.execute(
            create_usage_mutation, variable_values={
                "date": date, "type": "send_email", "owned_by": owned_by}
        )
        if response['insert_usage']['affected_rows'] == 1:
            return HTMLResponse(status_code=204)
        else:
            return HTMLResponse(status_code=500)
