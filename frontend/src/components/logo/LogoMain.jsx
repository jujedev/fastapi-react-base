/* eslint-disable prettier/prettier */
// material-ui
import { useTheme } from '@mui/material/styles';

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain() {
  const theme = useTheme();
  return (
    <>
      <svg width="180" height="80" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ícono nube en SVG */}
        <path
          d="M40 30C36 30 33 27 33 23.5C33 21 34.5 18.5 37 17.5C37.5 13 41 10 45.5 10C50 10 53.5 13.5 54 17.5C57 18 59 20.5 59 23.5C59 27 56 30 52 30H40Z"
          fill={theme.palette.primary.light}
          stroke={theme.palette.primary.lighter}
          strokeWidth="0"
        />
        {/* Texto TEKJUY */}
        <text
          x="65"
          y="29"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="bold"
          fontSize="25"
          fill={theme.palette.common.black}
        >
          <tspan fill={theme.palette.primary.light}>TEK</tspan>
          <tspan fill={theme.palette.grey[800]}>JUY</tspan>
        </text>
      </svg>
    </>
  );
}
