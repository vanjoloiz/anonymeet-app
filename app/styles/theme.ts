"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#0B72FF" },
    secondary: { main: "#FFB400", contrastText: "#000" },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default theme;
