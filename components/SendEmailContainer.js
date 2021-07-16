import Button from 'components/Button'
import { useMutation, gql } from '@apollo/client'

const OWNED_BY = 'http://gateway:8000/api/account/company/1086/'
const SURVEY_ID = 'sur_123'

export default function SendEmailContainer() {
  const [insertSendEmailEvent] = useMutation(INSERT_SEND_EMAIL_EVENT, {
    onCompleted: onCompleted,
  })
  const [insertMultipleCustomer] = useMutation(INSERT_MULTIPLE_CUSTOMER, {
    onCompleted: onCustomerInserted,
  })

  function onCustomerInserted(data) {
    console.log('Customer created!', data)
    const customers = data?.insert_customer?.returning || []
    const batch = customers.map((customer) => ({
      email: customer.email,
      customer_id: customer.id,
      ticket_id: 'ticket_123',
      owned_by: customer.owned_by,
    }))

    insertSendEmailEvent({
      variables: {
        owned_by: OWNED_BY,
        survey_id: SURVEY_ID,
        batch,
      },
    })
  }

  function onCompleted() {
    alert('Sent email event!')
  }
  return (
    <div className="my-5">
      <Button
        onClick={() => {
          insertMultipleCustomer({
            variables: {
              customers: [
                {
                  email: 'pan+9@simplesat.io',
                  owned_by: 'http://gateway:8000/api/account/company/1086/',
                  name: 'Pan 9',
                },
                {
                  email: 'pan+10@simplesat.io',
                  owned_by: 'http://gateway:8000/api/account/company/1086/',
                  name: 'Pan 10',
                },
              ],
            },
          })
        }}
      >
        Send email event
      </Button>
    </div>
  )
}

const INSERT_SEND_EMAIL_EVENT = gql`
  mutation InsertSendEmailEvent($owned_by: String, $survey_id: String, $batch: jsonb) {
    insert_send_email_event(
      objects: { owned_by: $owned_by, survey_id: $survey_id, batch: $batch }
    ) {
      affected_rows
      returning {
        id
        batch
        owned_by
        survey_id
      }
    }
  }
`

const INSERT_MULTIPLE_CUSTOMER = gql`
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
