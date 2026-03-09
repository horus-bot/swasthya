import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  width = 48,
  height = 48,
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

export default Logo;