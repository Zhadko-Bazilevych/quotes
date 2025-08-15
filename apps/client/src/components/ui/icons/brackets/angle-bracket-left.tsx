import type { JSX, SVGProps } from 'react';

type AngleBracketLeftProps = SVGProps<SVGSVGElement>;

export function AngleBracketLeft(props: AngleBracketLeftProps): JSX.Element {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M137.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 342.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"></path>
    </svg>
  );
}
