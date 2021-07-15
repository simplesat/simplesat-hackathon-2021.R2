import tw from 'twin.macro'

/**
 *
 * @param {object} props
 * @param {() => void} props.onChange
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
  className,
  type,
  onBlur,
  onInvalid,
  onFocus,
  disabled,
  required,
}) {
  return (
    <input
      css={[
        tw`px-4 py-2 block mb-4 last-of-type:mb-0
        border-0 shadow outline-none ring-1 ring-gray-300 focus:ring-1 focus:ring-gray-500 focus:ring-opacity-50
        disabled:cursor-default disabled:opacity-70
        rounded-md`,
        className,
      ]}
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
