import { SVGProps, useId } from 'react'

type Props = SVGProps<SVGSVGElement> & {
  direction?: 'top' | 'bottom'
}

const IconArrowDirection = ({ direction = 'bottom', ...props }: Props) => {
  const maskId = useId()
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      {...props}
    >
      <mask
        id={maskId}
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="28"
        height="28"
      >
        <rect width="28" height="28" fill="#D9D9D9" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <path
          d="M13.4403 16.5363L9.7638 12.8601C9.71324 12.8094 9.67338 12.7527 9.64421 12.6901C9.61505 12.6277 9.60046 12.5607 9.60046 12.4891C9.60046 12.3462 9.64878 12.222 9.74542 12.1164C9.84206 12.011 9.96942 11.9583 10.1275 11.9583H17.8724C18.0305 11.9583 18.1579 12.0116 18.2545 12.1181C18.3511 12.2245 18.3995 12.3487 18.3995 12.4906C18.3995 12.5262 18.3449 12.6494 18.2358 12.8601L14.5597 16.5363C14.4753 16.6209 14.388 16.6826 14.2978 16.7215C14.2075 16.7604 14.1083 16.7799 14 16.7799C13.8917 16.7799 13.7924 16.7604 13.7022 16.7215C13.6119 16.6826 13.5246 16.6209 13.4403 16.5363Z"
          fill="#474747"
          transform={direction === 'top' ? 'rotate(180 14 14)' : undefined}
        />
      </g>
    </svg>
  )
}

export default IconArrowDirection
