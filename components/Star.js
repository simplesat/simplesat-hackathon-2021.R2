export default function Star({ isActive }) {
  if (isActive) {
    return (
      <svg
        width="70"
        height="66"
        viewBox="0 0 70 66"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M35 0L43.0825 24.8754H69.238L48.0778 40.2492L56.1603 65.1246L35 49.7508L13.8397 65.1246L21.9222 40.2492L0.761967 24.8754H26.9175L35 0Z"
          fill="#FBBD08"
        />
      </svg>
    )
  }

  return (
    <svg width="70" height="66" viewBox="0 0 70 66" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M35 1.61804L42.607 25.0299L42.7192 25.3754H43.0825H67.6992L47.7839 39.8447L47.49 40.0582L47.6022 40.4037L55.2092 63.8156L35.2939 49.3463L35 49.1327L34.7061 49.3463L14.7908 63.8156L22.3978 40.4037L22.51 40.0582L22.2161 39.8447L2.30081 25.3754H26.9175H27.2808L27.393 25.0299L35 1.61804Z"
        fill="white"
        stroke="#9B9B9B"
      />
    </svg>
  )
}
