import { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

export default async (req: VercelRequest, res: VercelResponse) => {
  if (!isRequestValid(req)) {
    return res.json({
      message: 'Request not from Hasura',
    })
  }

  console.log('request body', req.body)
  console.log('request headers', req.headers)

  const body = req.body
  if (body.action.name === 'custom_insert_send_email_event') {
    const { owned_by, survey_id, batch } = req.body.input
    const customers = (
      await fetchGraphql({
        query: INSERT_MULTIPLE_CUSTOMERS_MUTATION,
        variables: {
          customers: batch.map((customer) => {
            return {
              email: customer.email,
              owned_by,
            }
          }),
        },
      })
    ).data.insert_customer.returning

    const customersByEmail = byKey('email', customers)

    const sendEmailEvent = (
      await fetchGraphql({
        query: INSERT_EMAIL_EVENT_MUTATION,
        variables: {
          owned_by,
          survey_id,
          batch: batch.map((customer) => {
            return {
              email: customer.email,
              ticket_id: customer.ticket_id,
              customer_id: customersByEmail[customer.email].id,
              owned_by: owned_by,
            }
          }),
        },
      })
    ).data.insert_send_email_event_one

    return res.json(sendEmailEvent)
  } else {
    return res.json({
      message: `Invalid action: ${body.action.name}`,
    })
  }
}

function byKey(key, objects: any[]) {
  return objects.reduce((objectsByKey, object) => {
    return {
      ...objectsByKey,
      [object[key]]: object,
    }
  }, {})
}

type GraphqlFetchConfiguration = {
  query: String
  variables?: Object
}

function fetchGraphql(graphqlFetchConfiguration: GraphqlFetchConfiguration) {
  return axios(process.env.HASURA_GRAPHQL_SERVER as string, {
    method: 'post',
    data: graphqlFetchConfiguration,
    headers: {
      'Content-Type': 'application/json',
      'X-Hasura-Admin-Secret': process.env.HASURA_ADMIN_SECRET as string,
    },
  }).then((response) => response.data)
}

function isRequestValid(req: VercelRequest) {
  return req.headers['x-simplesat-secret'] === process.env.SIMPLESAT_SECRET_TOKEN
}

const INSERT_MULTIPLE_CUSTOMERS_MUTATION = `
  mutation insert_multiple_customers($customers: [customer_insert_input!]!) {
    insert_customer(
      objects: $customers
      on_conflict: { constraint: customer_email_owned_by_key, update_columns: [name] }
    ) {
        returning {
          id
          email
          name
          owned_by
        }
    }
  }
`

const INSERT_EMAIL_EVENT_MUTATION = `
  mutation insert_email_event_one($owned_by: String, $survey_id: String, $batch: jsonb) {
    insert_send_email_event_one(
      object: { owned_by: $owned_by, survey_id: $survey_id, batch: $batch }
    ) {
        id
        created_at
        modified_at
        batch
        owned_by
        survey_id
      }
  }
`
