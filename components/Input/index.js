import tw, { css } from 'twin.macro'
import classNames from 'classnames'

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
export default function Input({
  onChange,
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
  if (label) {
    return (
      <label>
        <span tw="text-sm">
          <strong tw="font-medium">{label}</strong>
          {!required && ' - optional'}
        </span>
        <input
          className={classNames(className, 'mt-2')}
          css={inputCss}
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
    )
  } else {
    return (
      <input
        className={className}
        css={inputCss}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        onInvalid={onInvalid}
        onFocus={onFocus}
      />
    )
  }
}

const inputCss = css(tw`
  px-4 py-2 block mb-4 last-of-type:mb-0
  border-0 shadow outline-none ring-1 ring-gray-300 hover:ring-gray-400 focus:ring-blue-500
  disabled:cursor-default disabled:opacity-70 disabled:hover:ring-gray-300
  rounded-md
`)
