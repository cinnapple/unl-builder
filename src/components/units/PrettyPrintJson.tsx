import * as React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { createStyles, withStyles, WithStyles } from "../../lib/material-ui";
import IconButton from "@material-ui/core/IconButton";
import FilterNone from "@material-ui/icons/FilterNone";
import CodeText from "./CodeText";
import MessageBar from "./MessageBar";

const styles = theme =>
  createStyles({
    root: {
      position: "relative",
      width: "100%"
    },
    button: {
      position: "absolute",
      right: 0,
      borderRadius: "unset",
      boxShadow: "none",
      opacity: 0.8,
      borderTopRightRadius: "4px",
      backgroundColor: "white"
    },
    pre: {
      margin: 0,
      color: "#fff",
      backgroundColor: "#2C3E50",
      overflowX: "auto",
      padding: "10px",
      borderRadius: "4px"
    }
  });

interface Props extends WithStyles<typeof styles> {
  json: any;
  width?: number;
  maxHeight?: number;
}

interface State {
  messageBarOpen: boolean;
}

class PrettyPrintJson extends React.Component<Props, State> {
  state = {
    messageBarOpen: false
  };

  handleCopy = () => {
    this.setState({
      messageBarOpen: true
    });
  };

  handleMessageBarClose = () => {
    this.setState({
      messageBarOpen: false
    });
  };

  render = () => {
    const { messageBarOpen } = this.state;
    const { classes, maxHeight, json } = this.props;
    const text = JSON.stringify(json, null, 4);
    return (
      <div className={classes.root} style={{ maxHeight }}>
        <CopyToClipboard text={text} onCopy={this.handleCopy}>
          <IconButton className={classes.button}>
            <FilterNone />
          </IconButton>
        </CopyToClipboard>
        <pre className={classes.pre}>
          <CodeText text={text} />
        </pre>
        <MessageBar
          open={messageBarOpen}
          onClose={this.handleMessageBarClose}
          message="Code Copied!"
        />
      </div>
    );
  };
}

export default withStyles(styles)(PrettyPrintJson);
