import Button from 'components/Button'
import { useMutation, gql } from '@apollo/client'

export default function SendEmailContainer() {
  const [insertSendEmailEvent] = useMutation(INSERT_SEND_EMAIL_EVENT, {
    onCompleted: onCompleted,
  })

  function onCompleted() {
    alert('Sent email event!')
  }
  return (
    <div className="my-5">
      <Button
        onClick={() => {
          insertSendEmailEvent({
            variables: {
              owned_by: 'com_123',
              survey_id: 'sur_123',
              batch: [{ email: 'pan@simplesat.io', ticket_id: 'tic_123' }],
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
