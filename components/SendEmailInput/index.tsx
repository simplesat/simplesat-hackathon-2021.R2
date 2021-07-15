import { SetStateAction, useState } from 'react'
import produce from 'immer'
import tw from 'twin.macro'

import Form from 'components/Form'
import TicketInput from 'components/TicketInput'

export type SendEmailInputProps = {
  onChange: (value: any) => void
}

type Batch = {
  email: string
  ticket_id: string
}

export default function SendEmailInput({ onChange }: SendEmailInputProps) {
  const [batches, setBatches] = useState<[Batch]>([{ email: '', ticket_id: '' }])

  function setBatchesWithOnChange(setStateAction: SetStateAction<typeof batches>) {
    if (typeof setStateAction === 'function') {
      setBatches((batches) => {
        const newBatches = setStateAction(batches)
        onChange(newBatches)
        return newBatches
      })
    } else {
      onChange(setStateAction)
      setBatches(setStateAction)
    }
  }
  return (
    <Form>
      {batches.map((batch, batchIndex) => {
        function handleEmailChange(email) {
          setBatchesWithOnChange((batches) => {
            return produce(batches, (draftBatches) => {
              draftBatches[batchIndex].email = email
            })
          })
        }

        function handleTicketIdChange(ticketId) {
          setBatchesWithOnChange((batches) => {
            return produce(batches, (draftBatches) => {
              draftBatches[batchIndex].ticket_id = ticketId
            })
          })
        }
        return (
          <>
            <FormInput
              label="Email"
              required
              type="email"
              placeholder="Email"
              value={batch.email}
              onChange={handleEmailChange}
              className="!mr-8"
            />
            <FormInput required as={TicketInput} onChange={handleTicketIdChange} />
          </>
        )
      })}
    </Form>
  )
}

const FormInput = tw(Form.Input)`inline-block`
