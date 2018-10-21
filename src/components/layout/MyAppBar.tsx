import * as React from "react";
import { createStyles, withStyles, WithStyles } from "../../lib/material-ui";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const styles = theme =>
  createStyles({
    toolbarMain: {},
    toolbarTitle: {
      flex: 1,
      fontFamily: "Pacifico",
      lineHeight: 3
    }
  });

interface Props extends WithStyles<typeof styles> {
  title: string;
}

const MyAppBar: React.SFC<Props> = ({ classes, title }) => (
  <Toolbar className={classes.toolbarMain}>
    <Typography
      variant="h5"
      color="inherit"
      align="center"
      noWrap
      className={classes.toolbarTitle}
    >
      {title}
    </Typography>
  </Toolbar>
);

export default withStyles(styles)(MyAppBar);
