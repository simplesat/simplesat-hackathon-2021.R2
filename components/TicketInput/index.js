import React from 'react'
import tw, { css } from 'twin.macro'
import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/pro-solid-svg-icons'

/**
 *
 * @param {object} props
 * @param {() => void} props.onChange
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
  return (
    <span tw="relative inline-block">
      <label tw="pointer-events-none">
        {label && (
          <span tw="text-sm">
            <strong tw="font-medium">{label}</strong>
            {!required && ' - optional'}
          </span>
        )}
        <input
          className={classNames(className, 'mt-2')}
          css={[inputCss, tw`pr-10`]}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          required={required}
          onChange={onChange}
          onBlur={onBlur}
          onInvalid={onInvalid}
          onFocus={onFocus}
        />
      </label>
      <FontAwesomeIcon
        icon={faSyncAlt}
        tw="absolute right-3 bottom-3 text-gray-500 hover:text-gray-600 cursor-pointer pointer-events-auto"
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
