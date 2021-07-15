import tw, { css } from 'twin.macro'

/**
 *
 * @param {object} props
 * @param {(value: string) => void} props.onChange
 * @param {string} [props.value]
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
export default function Input({
  onChange,
  value,
  label,
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
    <span tw="mr-4 last-of-type:mr-0" className={className}>
      <label>
        {label && (
          <span tw="text-sm">
            <strong tw="font-medium">{label}</strong>
            {!required && ' - optional'}
          </span>
        )}
        <input
          value={value}
          className="mt-2"
          css={inputCss}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          required={required}
          onChange={(e) => {
            onChange(e.target.value)
          }}
          onBlur={onBlur}
          onInvalid={onInvalid}
          onFocus={onFocus}
        />
      </label>
    </span>
  )
}

const inputCss = css`
  ${tw`
    px-4 py-2 block mb-4 last-of-type:mb-0
    border-0 shadow outline-none ring-1 ring-gray-300 hover:ring-gray-400 focus:ring-blue-500
    disabled:cursor-default disabled:opacity-70 disabled:hover:ring-gray-300
    rounded-md
  `}
`
