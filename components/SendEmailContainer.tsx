import { useMutation, gql } from '@apollo/client'
import { useState } from 'react'

import Button from './Button'

import SendEmailInput from './SendEmailInput'

const OWNED_BY = 'http://gateway:8000/api/account/company/1086/'

type Batch = {
  email: string
  ticket_id: string
}

export default function SendEmailContainer() {
  const [insertSendEmailEvent] = useMutation(INSERT_SEND_EMAIL_EVENT, {
    onCompleted: onInsertSendEmailEvent,
  })

  const [batch, setBatch] = useState<Batch[]>([])
  const [surveyId, setSurveyId] = useState<string>(() => randomBase62SurveyId())

  function sendEmail() {
    insertSendEmailEvent({
      variables: {
        owned_by: OWNED_BY,
        survey_id: surveyId,
        batch,
      },
    })
    setSurveyId(randomBase62SurveyId())
  }

  function onInsertSendEmailEvent() {
    alert('Sent email event!')
  }

  return (
    <div>
      <SendEmailInput onChange={setBatch} />
      <Button type="primary" onClick={sendEmail}>
        Send email
      </Button>
    </div>
  )
}

const INSERT_SEND_EMAIL_EVENT = gql`
  mutation CustomInsertSendEmailEvent($owned_by: String, $survey_id: String, $batch: jsonb) {
    custom_insert_send_email_event(
      owned_by: $owned_by, survey_id: $survey_id, batch: $batch
    ) {
      id
      batch
      owned_by
      survey_id
    }
  }
`

function randomBase62SurveyId() {
  const prefix = 'sur_'
  const numberOfIdCharacters = 14
  const base62Characters = 'abcdefghijklmnopqrstuvwzyzABCDEFGHIJKLMNOPQRSTUVWZYZ0123456789'

  const randomizedNumbers = new Uint8Array(numberOfIdCharacters)
  window.crypto.getRandomValues(randomizedNumbers)
  const randomTicketId = Array.from(randomizedNumbers)
    .map(mod(base62Characters.length))
    .map(toCharacter(base62Characters))
    .join('')

  return prefix + randomTicketId
}

const mod = (modulus) => (number) => number % modulus

const toCharacter = (characters) => (index) => {
  return characters[index]
}
