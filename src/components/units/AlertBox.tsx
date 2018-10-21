import * as React from "react";
import classnames from "classnames";
import { createStyles, withStyles, WithStyles } from "../../lib/material-ui";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import Typography from "@material-ui/core/Typography";

export enum AlertBoxType {
  YELLOW = "YELLOW",
  ORANGE = "ORANGE",
  GREEN = "GREEN",
  RED = "RED"
}

const styles = theme =>
  createStyles({
    flexChildBox: {
      width: "100%"
    },
    titleBox: {
      padding: theme.spacing.unit * 1,
      paddingLeft: theme.spacing.unit * 1.5,
      backgroundColor: lighten(theme.palette.primary.light, 0.85)
    },
    highlight_YELLOW: {
      backgroundColor: lighten("#ffff00", 0.85)
    },
    highlight_ORANGE: {
      backgroundColor: lighten("#ffa500", 0.85)
    },
    highlight_GREEN: {
      backgroundColor: lighten(theme.palette.secondary.light, 0.85)
    },
    highlight_RED: {
      backgroundColor: lighten("#ff0000", 0.85)
    },
    bordered_YELLOW: {
      border: `1px solid ${lighten("#ffff00", 0.425)}`
    },
    bordered_ORANGE: {
      border: `1px solid ${lighten("#ffa500", 0.425)}`
    },
    bordered_GREEN: {
      border: `1px solid ${lighten(theme.palette.secondary.light, 0.425)}`
    },
    bordered_RED: {
      border: `1px solid ${lighten("#ff0000", 0.425)}`
    }
  });

interface Props extends WithStyles<typeof styles> {
  color: AlertBoxType;
  bordered?: boolean;
}

const AlertBox: React.SFC<Props> = ({
  classes,
  color,
  bordered = false,
  children
}) => (
  <div
    className={classnames(classes.titleBox, {
      [classes[`highlight_${color}`]]: !!color,
      [classes[`bordered_${color}`]]: bordered
    })}
  >
    <Typography component="div" variant="subtitle1">
      {children}
    </Typography>
  </div>
);

export default withStyles(styles)(AlertBox);
