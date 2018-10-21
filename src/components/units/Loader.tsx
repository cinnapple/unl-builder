import * as React from "react";
import { createStyles, withStyles, WithStyles } from "../../lib/material-ui";
import { lighten } from "@material-ui/core/styles/colorManipulator";
// tslint:disable-next-line:import-name
import ReactLoaderSpinner from "react-loader-spinner";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";

const styles = theme =>
  createStyles({
    root: {
      position: "fixed",
      top: 0,
      backgroundColor: lighten(theme.palette.primary.light, 0.85),
      height: "100%",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column"
    },
    typography: {
      fontFamily: "'Pacifico'",
      lineHeight: 2
    }
  });

interface Props extends WithStyles<typeof styles> {
  title: string;
  isLoading: boolean;
}

const Loader: React.SFC<Props> = ({ title, classes, isLoading }) => (
  <Fade in={isLoading}>
    <div className={classes.root} style={{ zIndex: isLoading ? 1000 : -1000 }}>
      <Typography variant="h4" className={classes.typography} noWrap>
        {title}
      </Typography>
      <ReactLoaderSpinner type="ThreeDots" height={80} width={80} />
    </div>
  </Fade>
);

export default withStyles(styles)(Loader);
