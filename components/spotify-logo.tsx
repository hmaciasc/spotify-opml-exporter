import type React from "react"
export function SpotifyLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 11.973c2.5-1.473 5.5-.973 7.5.527" />
      <path d="M9 15c1.5-.5 3-.5 4.5.5" />
      <path d="M9 9c1.5-.5 3.5-.5 5 0" />
    </svg>
  )
}

