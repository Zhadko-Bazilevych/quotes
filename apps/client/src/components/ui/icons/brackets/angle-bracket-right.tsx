import type { JSX, SVGProps } from 'react';

type AngleBracketRightProps = SVGProps<SVGSVGElement>;

export function AngleBracketRight(props: AngleBracketRightProps): JSX.Element {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M374.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L306.7 256 169.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path>
    </svg>
  );
}
