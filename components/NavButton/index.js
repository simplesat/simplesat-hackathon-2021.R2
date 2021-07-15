import Link from 'next/link'
import { withRouter } from 'next/router'
import tw, { css } from 'twin.macro'

/**
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.path
 * @param {object} props.icon
 */
export default withRouter(NavButton)
function NavButton({ label, path, icon, router }) {
  const menuItemStyles = css`
    ${tw`flex items-center  py-1 md:py-3 pl-4 align-middle no-underline`}
    &:hover {
      ${tw`bg-green-50 border-r-4 border-green-400`}
    }
  `

  const menuItemTextStyles = css`
    ${tw`!ml-2 pb-1 md:pb-0 text-xs md:text-base block md:inline-block`}
  `
  const activeMenuStyles = css`
    ${tw`bg-green-50 border-r-4 border-green-400`}
  `

  return (
    <Link href={path}>
      <a css={[menuItemStyles, router.pathname === path && activeMenuStyles]}>
        {icon}
        <span css={menuItemTextStyles}>{label}</span>
      </a>
    </Link>
  )
}
