import * as React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";

interface Props {
  open: boolean;
  message: string;
  onClose: () => void;
}

interface State {
  Transition: any;
}

const TransitionComponent = props => <Slide {...props} direction="up" />;

class MessageBar extends React.Component<Props, State> {
  state = {
    Transition: TransitionComponent
  };
  handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.props.onClose();
  };

  render = () => {
    const { open, message } = this.props;
    const { Transition } = this.state;
    return (
      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={this.handleClose}
        TransitionComponent={Transition}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={message}
      />
    );
  };
}

export default MessageBar;
