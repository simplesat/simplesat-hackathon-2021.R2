import tw from 'twin.macro'

/**
 * @typedef {'basic'|'primary'} ButtonType
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {() => void} props.onClick
 * @param {string} [props.className]
 * @param {ButtonType} [props.type]
 * @param {boolean} [props.disabled]
 */
export default function Button({ children, type = 'basic', className, onClick, disabled }) {
  const typeStyles = {
    basic: tw`color[inherit] bg-gray-200 hover:bg-gray-300 disabled:hover:bg-gray-200`,
    primary: tw`text-white bg-blue-600 hover:bg-blue-700 disabled:hover:bg-blue-600`,
  }

  return (
    <button
      className={className}
      css={[
        tw`flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md cursor-pointer`,
        tw`disabled:cursor-default disabled:opacity-70`,
        typeStyles[type],
      ]}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
