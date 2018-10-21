import * as React from "react";
import { createStyles, withStyles, WithStyles } from "../lib/material-ui";
import Paper from "@material-ui/core/Paper";
import Loader from "../components/units/Loader";
import MyAppBar from "../components/layout/MyAppBar";
import XRPTipBotButton from "../components/units/XRPTipBotButton";
import config from "../lib/config";

const styles = theme =>
  createStyles({
    layout: {
      width: 880,
      marginLeft: "auto",
      marginRight: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    main: {
      padding: theme.spacing.unit * 2,
      width: "100%",
      marginBottom: theme.spacing.unit * 2
    },
    spacer: {
      marginBottom: theme.spacing.unit * 5
    }
  });

interface Props extends WithStyles<typeof styles> {
  title: string;
  isLoading: boolean;
}

const Layout: React.SFC<Props> = ({ classes, title, isLoading, children }) => (
  <>
    <Loader title={title} isLoading={isLoading} />
    {!isLoading && (
      <div className={classes.layout}>
        <MyAppBar title={title} />
        <Paper className={classes.main}>
          <main>{children}</main>
        </Paper>
        <XRPTipBotButton {...config.xrptipbot} />
        <div className={classes.spacer} />
      </div>
    )}
  </>
);

export default withStyles(styles)(Layout);
