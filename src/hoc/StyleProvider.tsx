import * as React from "react";

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import CssBaseline from "@material-ui/core/CssBaseline";

const createDynamicMuiTheme = type => {
  return createMuiTheme({
    palette: {
      type,
      primary: {
        main: type === "dark" ? "#303030" : "#2C3E50"
      },
      secondary: {
        main: "#18BC9C"
      }
    },
    typography: {
      useNextVariants: true,
      fontFamily: ["'Roboto'", "sans-serif"].join(",")
    },
    ...({
      drawerWidth: 250
    } as any)
  });
};

export default ({ children }) => (
  <MuiThemeProvider theme={createDynamicMuiTheme("light")}>
    <CssBaseline />
    {children}
  </MuiThemeProvider>
);
