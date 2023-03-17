import React from "react";

const LeftArrow = ({ size = 20 }) => (
  <svg
    width={size}
    height={(size * 17) / 18}
    viewBox="0 0 18 17"
    fill="none"
    className={`rotate-180 pr-1 transition-opacity duration-100 ease-in-out hover:cursor-pointer opacity-1 active:opacity-50`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.52 0.175999H6.88C6.88 1.88 6.304 3.32 5.2 4.472C4.096 5.648 2.512 6.728 0.448 7.736V9.44C2.512 10.448 4.096 11.552 5.2 12.704C6.304 13.88 6.88 15.296 6.88 16.976H9.52C9.52 15.056 9.04 13.496 8.104 12.32C7.168 11.168 5.92 10.352 4.36 9.896V9.776H17.728V7.376H4.36V7.232C5.92 6.8 7.168 6.008 8.104 4.832C9.04 3.68 9.52 2.12 9.52 0.175999Z"
      fill="white"
    />
  </svg>
);

export default LeftArrow;
