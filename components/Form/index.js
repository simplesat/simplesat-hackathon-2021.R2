import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/react'

import Input from 'components/Input'

/**
 * @typedef ContextValue
 * @property {React.MutableRefObject<?HTMLButtonElement>} hiddenButtonRef
 * @property {(callback: function) => function} registerOnSubmitCallback
 */

/** @type {React.Context<Partial<ContextValue>>} */
const formContext = createContext({})

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export default function Form({ children }) {
  const hiddenButtonRef = useRef(null)
  const [onSubmitCallbacks, setOnSubmitCallback] = useState(new Set())

  const registerOnSubmitCallback = useCallback(function (onSubmitCallback) {
    setOnSubmitCallback((onSubmitCallbacks) => {
      const newOnSubmitCallbacks = new Set(onSubmitCallbacks)
      newOnSubmitCallbacks.add(onSubmitCallback)

      return newOnSubmitCallbacks
    })

    const cleanUpOnSubmitCallbacks = () => {
      setOnSubmitCallback((onSubmitCallbacks) => {
        const newOnSubmitCallbacks = new Set(onSubmitCallbacks)
        newOnSubmitCallbacks.delete(onSubmitCallback)

        return newOnSubmitCallbacks
      })
    }

    return cleanUpOnSubmitCallbacks
  }, [])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmitCallbacks.forEach((onSubmitCallback) => {
          onSubmitCallback()
        })
      }}
    >
      <formContext.Provider value={{ hiddenButtonRef, registerOnSubmitCallback }}>
        {children}
        <button hidden ref={hiddenButtonRef} />
      </formContext.Provider>
    </form>
  )
}

/**
 * @param {React.ComponentProps<typeof Input>} props
 */
Form.Input = function FormInput(props) {
  const [formInputMachineState, sendFormInputEvent] = useMachine(formInputMachine)
  console.log('inputStatus', formInputMachineState.value)
  const { hiddenButtonRef, registerOnSubmitCallback } = useContext(formContext)

  useEffect(() => {
    // If this component isn't in the Form then `registerOnSubmitCallback` will be `undefined`
    if (registerOnSubmitCallback) {
      const unregisterOnSubmitCallback = registerOnSubmitCallback(() => {
        sendFormInputEvent({
          type: 'onSubmit',
        })
      })

      return () => {
        unregisterOnSubmitCallback()
      }
    }
  }, [registerOnSubmitCallback, sendFormInputEvent])
  function handleBlur() {
    // Seems like blur isn't done, before we click submit the form
    // to trigger form validation, that's why I need to wait another
    // event loop.
    setTimeout(() => {
      hiddenButtonRef?.current?.click()
    })
  }

  return (
    <>
      inputStatus: {formInputMachineState.value}
      <Input
        {...props}
        onBlur={handleBlur}
        onFocus={() => {
          sendFormInputEvent({
            type: 'onFocus',
          })
        }}
        onInvalid={() => {
          sendFormInputEvent({
            type: 'onInvalid',
          })
        }}
        onChange={() => {
          sendFormInputEvent({
            type: 'onChange',
          })
        }}
      />
    </>
  )
}

/**
 * @typedef {'TOUCHED'|'UNTOUCHED'|'VALID'|'INVALID'} FormInputStatus
 *
 * @typedef FormInputEvent
 * @property {'onFocus'|'onInvalid'|'onSubmit'|'onChange'} type
 *
 * @typedef {import('xstate').StateMachine<any, FormInputStatus, FormInputEvent, {value: any, context: any}>} MyStateMachine
 */

/**
 * @type {MyStateMachine}
 */
const formInputMachine = createMachine({
  id: 'formInput',
  initial: 'UNTOUCHED',
  states: {
    UNTOUCHED: {
      on: {
        onFocus: { target: 'TOUCHED' },
      },
    },
    TOUCHED: {
      on: {
        onChange: { target: 'TOUCHED' },
        onSubmit: { target: 'VALID' },
        onInvalid: { target: 'INVALID' },
      },
    },
    VALID: {
      on: {
        onFocus: { target: 'TOUCHED' },
        onChange: { target: 'TOUCHED' },
        onInvalid: { target: 'INVALID' },
      },
    },
    INVALID: {
      on: {
        onFocus: { target: 'INVALID' },
        onSubmit: { target: 'VALID' },
        onChange: { target: 'TOUCHED' },
      },
    },
  },
})
