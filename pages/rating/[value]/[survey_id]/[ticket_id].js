import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import Star from 'components/Star'

export default function Rating() {
  const [insertReceiveFeedbackEvent] = useMutation(INSERT_RECEIVE_FEEDBACK_EVENT, {
    onCompleted: onCompleted,
  })

  const router = useRouter()
  const { customer, ticket_id, value, survey_id, owned_by } = router.query

  function onCompleted() {
    alert(`You've successfully give ${value} rating.`)
  }

  useEffect(() => {
    if (customer && ticket_id && value && survey_id && owned_by) {
      const variables = {
        customer_id: customer,
        feedback_value: value,
        owned_by: owned_by,
        survey_id: survey_id,
        ticket_id: ticket_id,
      }
      console.log('Rating -> variables', variables)
      insertReceiveFeedbackEvent({
        variables,
      })
    }
  }, [customer, ticket_id, value, survey_id, owned_by])

  return (
    <>
      <div className="h-screen grid place-items-center text-center">
        <div>
          <div className="my-5">
            <StarRating rating={Number(value)} />
          </div>
          <p className="text-2xl">Thanks for giving your feedback!</p>
          <p className="text-base mt-2">
            Your feedback helps us continually improve our service for you. <br></br>If you have any
            other ideas or anything else you need please let us know.
          </p>
          <hr className="my-5"></hr>
          <p className="text-sm">
            Customer ID: {customer} <br></br>
            Ticket ID: {ticket_id} <br></br>
            Rating: {value} <br></br>
          </p>
        </div>
      </div>
    </>
  )
}

function StarRating({ rating }) {
  if (rating > 0) {
    return (
      <div className="flex justify-center">
        {Array.from(Array(rating).keys()).map(() => (
          <Star isActive></Star>
        ))}
      </div>
    )
  }
  return null
}

const INSERT_RECEIVE_FEEDBACK_EVENT = gql`
  mutation InsertReceiveFeedbackEvent(
    $customer_id: String
    $feedback_value: String
    $owned_by: String
    $survey_id: String
    $ticket_id: String
  ) {
    insert_receive_feedback_event(
      objects: {
        customer_id: $customer_id
        feedback_value: $feedback_value
        owned_by: $owned_by
        survey_id: $survey_id
        ticket_id: $ticket_id
      }
    ) {
      affected_rows
      returning {
        id
        customer_id
        feedback_value
        ticket_id
        survey_id
      }
    }
  }
`
