import * as React from "react";

interface Props {
  condition: () => boolean;
}

class ScrollToBottom extends React.Component<Props> {
  bottomRef = undefined;

  scrollToBottom = () => {
    if (this.bottomRef) {
      this.bottomRef.scrollIntoView({ behavior: "smooth" });
    }
  };

  componentWillUpdate = () => {
    this.scrollToBottom();
  };

  render = () => {
    const { condition } = this.props;
    return (
      <div
        style={{ float: "left", clear: "both" }}
        ref={el => {
          if (condition()) {
            this.bottomRef = el;
          }
        }}
      />
    );
  };
}

export default ScrollToBottom;
