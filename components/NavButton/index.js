import React from 'react'
import tw, { css } from 'twin.macro'

export default React.forwardRef(
  /**
   * @param {object} props
   * @param {import('react').ReactNode} props.children
   * @param {boolean} [props.isActive]
   * @param {() => void} [props.onClick]
   */
  function NavButton({ isActive, children, onClick }, ref) {
    return (
      <a onClick={onClick} css={[menuItemStyles, isActive && activeMenuStyles]} ref={ref}>
        {children}
      </a>
    )
  }
)

const menuItemStyles = css`
  ${tw`cursor-pointer flex items-center py-1 md:py-3 pl-4 align-middle no-underline`}
  &:hover {
    ${tw`bg-green-50 border-r-4 border-green-400`}
  }
`

const activeMenuStyles = css`
  ${tw`bg-green-50 border-r-4 border-green-400`}
`
