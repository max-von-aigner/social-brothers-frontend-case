// File: components/CameraIcon.tsx
import React from "react";

const CameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  height = "100",
  width = "100",
  className = "",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    width={width}
    viewBox="0 0 100 100"
    className={className}
    fill="currentColor" // Allows applying tailwind colors
    {...props}
  >
    <g>
      <path d="M50 33.9c-10.5 0-19 8.5-19 19s8.5 19 19 19 19-8.5 19-19c0-10.4-8.5-19-19-19zm0 34c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15zm33-38L68 30l-6.3-9.2c-.4-.5-1-.8-1.6-.8H39.9c-.6 0-1.2.3-1.6.8L32 30H17c-4.4 0-8 3.5-8 7.9V72c0 4.4 3.6 8 8 8h66c4.4 0 8-3.6 8-8V37c0-4.4-3.6-7.1-8-7.1zM87 72c0 2.2-1.8 4-4 4H17c-2.2 0-4-1.8-4-4V37.9c0-2.2 1.8-3.9 4-3.9h16c.6 0 1.2-.3 1.6-.8l6.3-9.2h18.2l6.3 9.2c.4.5 1 .8 1.6.8l16-.1c2.2 0 4 .9 4 3.1v35z"></path>
    </g>
    <g>
      <path
        fill="#00F"
        d="M1364-650v1684H-420V-650h1784m8-8H-428v1700h1800V-658z"
      ></path>
    </g>
  </svg>
);

export default CameraIcon;
