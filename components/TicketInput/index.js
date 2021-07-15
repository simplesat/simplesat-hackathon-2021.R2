import React, { useState } from 'react'
import tw, { css } from 'twin.macro'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/pro-solid-svg-icons'

/**
 *
 * @param {object} props
 * @param {(value: string) => void} props.onChange
 * @param {string} [props.label]
 * @param {string} [props.placeholder]
 * @param {string} [props.className]
 * @param {() => void} [props.onBlur]
 * @param {() => void} [props.onInvalid]
 * @param {() => void} [props.onFocus]
 * @param {() => void} [props.onChange]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.required]
 * @param {string} [props.type]
 */
export default function TicketInput({
  onChange,
  label = 'Ticket ID',
  placeholder,
  className,
  type,
  onBlur,
  onInvalid,
  onFocus,
  disabled,
  required,
}) {
  const [randomizedTicketId, setRandomizedTicketId] = useState(() => {
    const randomizedTicketId = randomBase62TicketId()
    onChange(randomizedTicketId)

    return randomizedTicketId
  })

  function randomTicketId() {
    const randomizedTicketId = randomBase62TicketId()
    onChange(randomizedTicketId)

    setRandomizedTicketId(randomizedTicketId)
  }

  return (
    <span tw="relative inline-block mr-4 last-of-type:mr-0" className={className}>
      <label tw="pointer-events-none">
        {label && (
          <span tw="text-sm">
            <strong tw="font-medium">{label}</strong>
            {!required && ' - optional'}
          </span>
        )}
        <input
          value={randomizedTicketId}
          onSelect={(e) => {
            e.preventDefault()
          }}
          className="mt-2"
          css={[inputCss, tw`pr-10`]}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          required={required}
          onBlur={onBlur}
          onInvalid={onInvalid}
          onFocus={onFocus}
        />
      </label>
      <FontAwesomeIcon
        onClick={randomTicketId}
        icon={faSyncAlt}
        tw="absolute right-3 bottom-3 text-gray-500 hover:text-gray-600 cursor-pointer pointer-events-auto select-none"
      />
    </span>
  )
}

const inputCss = css(tw`
  px-4 py-2 block mb-4 last-of-type:mb-0
  border-0 shadow outline-none ring-1 ring-gray-300 hover:ring-gray-400 focus:ring-blue-500
  disabled:cursor-default disabled:opacity-70 disabled:hover:ring-gray-300
  rounded-md
`)

function randomBase62TicketId() {
  const prefix = 'tic_'
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
