import React from "react";

type Props = { size?: number };

const Locked = ({ size = 20 }: Props) => {
  return (
    <svg
      width={size}
      height={size * 1.25} // maintain aspect ratio
      viewBox="0 0 321 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M280.469 179.688V120C280.469 53.75 226.406 0 160.156 0C93.9062 0 39.8438 53.75 39.8438 120V179.688H0V400H320.312V179.688H280.469ZM80.4688 120C80.4688 75.7813 115.938 40 160.156 40C204.375 40 239.844 75.7813 239.844 120V179.688H80.4688V120Z"
        fill="black"
      />
    </svg>
  );
};

export default Locked;
