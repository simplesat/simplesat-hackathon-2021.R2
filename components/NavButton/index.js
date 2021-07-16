import tw, { css } from 'twin.macro'

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {boolean} [props.isActive]
 * @param {() => void} [props.onClick]
 */
export default function NavButton({ isActive, children, onClick }) {
  return (
    <a onClick={onClick} css={[menuItemStyles, isActive && activeMenuStyles]}>
      {children}
    </a>
  )
}

const menuItemStyles = css`
  ${tw`cursor-pointer flex items-center py-1 md:py-3 pl-4 align-middle no-underline`}
  &:hover {
    ${tw`bg-green-50 border-r-4 border-green-400`}
  }
`

const activeMenuStyles = css`
  ${tw`bg-green-50 border-r-4 border-green-400`}
`
