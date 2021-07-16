import { Dispatch, SetStateAction, useState } from 'react'
import produce from 'immer'
import tw from 'twin.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/pro-regular-svg-icons'

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
  const [batches, setBatches] = useState<Batch[]>([{ email: '', ticket_id: '' }])

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

  function addNewBatch() {
    setBatches((batches) => {
      return batches.concat({
        email: '',
        ticket_id: '',
      })
    })
  }

  return (
    <Form>
      <Batches batches={batches} setBatchesWithOnChange={setBatchesWithOnChange} />
      <AddNewEmailButton onClick={addNewBatch} className="mt-4" />
    </Form>
  )
}

const FormInput = tw(Form.Input)`inline-block`

type BatchesProps = {
  batches: Batch[]
  setBatchesWithOnChange: Dispatch<SetStateAction<Batch[]>>
}

function Batches({ batches, setBatchesWithOnChange }: BatchesProps) {
  return (
    <>
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
          <div key={batchIndex} tw="mb-4 last-of-type:mb-0">
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
          </div>
        )
      })}
    </>
  )
}

type AddNewEmailButtonProps = {
  onClick: () => void
  className?: string
}

function AddNewEmailButton({ onClick, className }: AddNewEmailButtonProps) {
  return (
    <a
      className={className}
      tw="inline-block cursor-pointer text-blue-500 hover:text-blue-600"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faPlus} size="lg" tw="mr-3" />
      Add new email
    </a>
  )
}
