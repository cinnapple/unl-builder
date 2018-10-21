import * as React from "react";
import { createStyles, withStyles, WithStyles } from "../../lib/material-ui";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";

import PrettyPrintJson from "../units/PrettyPrintJson";
import * as UnlBuilder from "../../lib/unl-builder";
import AlertBox, { AlertBoxType } from "../units/AlertBox";
import { IWizardStepProps } from "../layout/Wizard";

const styles = theme =>
  createStyles({
    paperRoot: {
      width: "100%",
      display: "flex"
    },
    flexChildBox: {
      width: "100%"
    },
    spacer: {
      marginBottom: theme.spacing.unit * 2
    },
    subTitle: {
      paddingLeft: theme.spacing.unit * 1.5,
      paddingTop: theme.spacing.unit * 1.5
    }
  });

interface Props extends WithStyles<typeof styles>, Partial<IWizardStepProps> {}

interface State {
  generatedUnl: any;
  status: Status;
}

enum Status {
  SUCCESS,
  GENERATING,
  FAILED
}

class GenerateView extends React.Component<Props, State> {
  state = {
    generatedUnl: undefined as Object,
    status: Status.GENERATING,
    copied: false
  };

  componentDidMount = () => {
    const { publisher, manifestFetchResults } = this.props;
    const validators = this.props.validators.filter(a => a.isSelected);
    const manifests = manifestFetchResults.map(a => a.manifest);
    const { generatedUnl } = this.state;
    if (!generatedUnl) {
      try {
        const unl = UnlBuilder.generateUnl(validators, publisher, manifests);
        this.setState({
          generatedUnl: unl,
          status: Status.SUCCESS
        });
      } catch (ex) {
        this.setState({
          generatedUnl: {},
          status: Status.FAILED
        });
      }
    }
  };

  render = () => {
    const { classes, publisher } = this.props;
    const { generatedUnl, status } = this.state;
    const keyPairs = {
      master: {
        seed: publisher.seed,
        private_key: publisher.secretKey,
        public_key: publisher.publicKey
      },
      signing: {
        seed: publisher.signingSeed,
        private_key: publisher.signingSecretKey,
        public_key: publisher.signingPublicKey
      }
    };

    return (
      <Paper classes={{ root: classes.paperRoot }} elevation={0}>
        <div className={classes.flexChildBox}>
          <AlertBox
            color={
              status === Status.SUCCESS ? AlertBoxType.GREEN : AlertBoxType.RED
            }
            bordered
          >
            {status === Status.SUCCESS
              ? "The UNL has been successfully generated 🎉"
              : status === Status.FAILED
                ? "Failed to generate the UNL 😵"
                : "Generating..."}
          </AlertBox>
          <div className={classes.spacer} />
          <PrettyPrintJson json={generatedUnl} maxHeight={400} />
          <Typography variant="subtitle1" className={classes.subTitle}>
            Below are the seed and drived key pairs used for authoring and
            signing your UNL. Keep them in a safe place
          </Typography>
          <PrettyPrintJson json={keyPairs} maxHeight={400} />
        </div>
      </Paper>
    );
  };
}

export default withStyles(styles)(GenerateView);
