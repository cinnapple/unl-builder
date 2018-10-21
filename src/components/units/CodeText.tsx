import * as React from "react";

const CodeText = ({ className = undefined, text, fontSize = "0.7rem" }) => (
  <code
    style={{
      fontSize,
      fontFamily: "'Source Code Pro'"
    }}
    className={className}
  >
    {text}
  </code>
);

export default CodeText;
