import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import { createMachine } from 'xstate'

import Input from 'components/Input'
import { useMachine } from '@xstate/react'

/**
 * @typedef ContextValue
 * @property {React.MutableRefObject<?HTMLButtonElement>} hiddenButtonRef
 * @property {(callback: function) => function} registerOnSubmitCallback
 */

/** @type {React.Context<ContextValue>} */
// If I use Partial<ContextValue>, this error will go away, but it make typing down there
// harder than it should be, because `registerOnSubmitCallback` will be nullable, and when
// function is nullable, it will be really hard to write type for them.
// @ts-ignore
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

    return () => {
      setOnSubmitCallback((onSubmitCallbacks) => {
        const newOnSubmitCallbacks = new Set(onSubmitCallbacks)
        newOnSubmitCallbacks.delete(onSubmitCallback)

        return newOnSubmitCallbacks
      })
    }
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
    const unregisterOnSubmitCallback = registerOnSubmitCallback(() => {
      sendFormInputEvent({
        type: 'onSubmit',
      })
    })
    return () => {
      unregisterOnSubmitCallback()
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
