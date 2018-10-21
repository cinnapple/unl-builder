import * as React from "react";

interface Props {
  to: string;
  amount: number;
  size?: number;
  network: string;
}

export default class XRPTipBotButton extends React.Component<Props, any> {
  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://www.xrptipbot.com/static/donate/tipper.js";
    script.async = true;
    document.body.appendChild(script);
  }

  render() {
    const { to, amount, size = 275, network } = this.props;

    return (
      <a
        {...{
          amount,
          to,
          network,
          size
        }}
        href="https://www.xrptipbot.com"
        target="_blank"
      />
    );
  }
}
