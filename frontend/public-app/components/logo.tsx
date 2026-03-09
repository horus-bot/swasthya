import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  width = 80,
  height = 80,
  className = ""
}) => {
  return (
    <img
      src="/logo.svg"
      alt="Swasthya Logo"
      width={width}
      height={height}
      className={className}
    />
  );
};
