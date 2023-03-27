import React from "react";

type Props = { size?: number };

const Unlocked = ({ size = 20 }: Props) => {
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
        d="M310 179.688H320.312V400H0V179.688H39.8438V120C39.8438 53.75 93.9062 0 160.156 0C223.718 0 276.061 49.4766 280.205 112H239.453C235.479 71.5447 201.675 40 160.156 40C115.938 40 80.4688 75.7813 80.4688 120V179.688H219V180H310V179.688Z"
        fill="black"
      />
    </svg>
  );
};

export default Unlocked;
