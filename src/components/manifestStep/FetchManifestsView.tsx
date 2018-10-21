import * as React from "react";
import { createStyles, withStyles, WithStyles } from "../../lib/material-ui";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
// tslint:disable-next-line:import-name
import ReactLoaderSpinner from "react-loader-spinner";
import CheckCircle from "@material-ui/icons/CheckCircle";
import Error from "@material-ui/icons/Error";
import CodeText from "../units/CodeText";
import AlertBox, { AlertBoxType } from "../units/AlertBox";
import ScrollToBottom from "../units/ScrollToBottom";
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
    listRoot: {
      position: "relative",
      overflow: "auto",
      height: 400
    },
    listItemRight: {
      right: "24px"
    }
  });

const getStatus = (status: Status) => {
  switch (status) {
    case Status.COMPLETED:
      return "Completed fetching manifests for all validators";
    case Status.RATELIMIT:
      return `Ripple Data API rate limit exceeded. Please wait for a while...☕`;
    case Status.FETCHING:
      return "Fetching manifests from Ripple data API...";
  }
};

const getFetchStatus = (
  fetchingForPubkey: string,
  validator: model.IValidatorSelection,
  manifestFetchResults: model.IManifestFetchResult[]
) => {
  if (validator.validation_public_key === fetchingForPubkey) {
    return ManifestFetchStatus.FETCHING;
  }
  const manif = manifestFetchResults.find(
    a => a.pubkey === validator.validation_public_key
  );
  if (!manif) {
    return ManifestFetchStatus.WAITING;
  }
  if (manif.manifest) {
    return ManifestFetchStatus.DONE;
  }
  if (manif.error) {
    return ManifestFetchStatus.ERROR; // "Error";
  }
  return ManifestFetchStatus.NOT_FOUND; // "Not found";
};

interface FetchResult {
  publicKey: string;
  successful: boolean;
  exceededRateLimit: boolean;
  manifest: api.Manifest;
}

const fetchManifest = async (publicKey: string) => {
  const res = await fetch(
    `https://data.ripple.com/v2/network/validators/${publicKey}/manifests`
  );
  const data = await res.json();
  const fetchSuccessful =
    res.status === 200 && data.manifests && data.manifests.length > 0;
  const exceededRateLimit = res.status === 429;
  return {
    publicKey,
    exceededRateLimit,
    manifest: data.manifests[0],
    successful: fetchSuccessful
  };
};

const getNextValidatorToFetchManFor = (
  validators: model.IValidatorSelection[],
  manifestFetchResults: model.IManifestFetchResult[]
) => {
  return validators.find(
    a =>
      a.isSelected &&
      !manifestFetchResults.find(r => r.pubkey === a.validation_public_key)
  );
};

enum Status {
  FETCHING = "FETCHING",
  RATELIMIT = "RATELIMIT",
  COMPLETED = "COMPLETED"
}

enum ManifestFetchStatus {
  FETCHING,
  WAITING,
  DONE,
  ERROR,
  NOT_FOUND
}

interface Props extends WithStyles<typeof styles>, Partial<IWizardStepProps> {}

interface State {
  rateLimit: boolean;
  rateLimitCount: number;
  fetchingForPubkey: string;
}

class FetchManifests extends React.Component<Props, State> {
  state = {
    rateLimit: false,
    rateLimitCount: 1,
    fetchingForPubkey: ""
  };

  clearTimeout = {
    fetch: undefined,
    rateLimit: undefined
  };

  handleFetchFail = (fetchResult: FetchResult) => {
    if (fetchResult.exceededRateLimit) {
      this.setState(
        {
          rateLimit: true
        },
        () => {
          if (this.clearTimeout.rateLimit) {
            clearTimeout(this.clearTimeout.rateLimit);
          }
          this.clearTimeout.rateLimit = setTimeout(() => {
            this.setState({
              fetchingForPubkey: "",
              rateLimit: false
            });
          }, this.state.rateLimitCount * 10 * 1000);
        }
      );
    }
  };

  handleFetchSuccessful = async (fetchResult: FetchResult) => {
    const { onPushManifestFetchResult } = this.props;
    if (this.clearTimeout.fetch) {
      clearTimeout(this.clearTimeout.fetch);
    }
    this.clearTimeout.fetch = setTimeout(() => {
      onPushManifestFetchResult({
        pubkey: fetchResult.publicKey,
        manifest: fetchResult.manifest
      });
      this.setState({
        fetchingForPubkey: ""
      });
    }, 500);
  };

  handleStartFetch = async (validator: model.IValidatorSelection) => {
    this.setState(
      {
        fetchingForPubkey: validator.validation_public_key
      },
      async () => {
        const fetchResult = await fetchManifest(
          validator.validation_public_key
        );
        if (fetchResult.successful) {
          return this.handleFetchSuccessful(fetchResult);
        }
        return this.handleFetchFail(fetchResult);
      }
    );
  };

  componentWillUpdate = (nextProps: Props, nextState: State) => {
    if (nextState.rateLimit) {
      return;
    }
    if (!!nextState.fetchingForPubkey) {
      return;
    }
    if (nextState.rateLimit) {
      return;
    }
    const validator = getNextValidatorToFetchManFor(
      nextProps.validators,
      nextProps.manifestFetchResults
    );
    if (!validator) {
      return;
    }
    this.handleStartFetch(validator);
  };

  componentWillUnmount = () => {
    // unsubscribe from IO operations
    if (this.clearTimeout.fetch) {
      clearTimeout(this.clearTimeout.fetch);
    }
    if (this.clearTimeout.rateLimit) {
      clearTimeout(this.clearTimeout.rateLimit);
    }
  };

  render = () => {
    const { classes, manifestFetchResults } = this.props;
    const { rateLimit, fetchingForPubkey } = this.state;
    const validators = this.props.validators.filter(a => a.isSelected);
    const status = rateLimit
      ? Status.RATELIMIT
      : validators.every(
          v =>
            !!manifestFetchResults.find(
              m => m.pubkey === v.validation_public_key && !!m.manifest
            )
        )
        ? Status.COMPLETED
        : Status.FETCHING;
    return (
      <Paper classes={{ root: classes.paperRoot }} elevation={0}>
        <div className={classes.flexChildBox}>
          <AlertBox
            color={
              status === Status.FETCHING
                ? AlertBoxType.YELLOW
                : status === Status.RATELIMIT
                  ? AlertBoxType.ORANGE
                  : AlertBoxType.GREEN
            }
            bordered
          >
            {getStatus(status)}
          </AlertBox>
          <List className={classes.listRoot}>
            {validators.map((validator, i) => {
              const fetchingStatus = getFetchStatus(
                fetchingForPubkey,
                validator,
                manifestFetchResults
              );
              return (
                <ListItem key={i} dense button>
                  <ListItemText
                    primary={validator.domain}
                    secondary={
                      <CodeText text={validator.validation_public_key} />
                    }
                  />
                  <ListItemSecondaryAction className={classes.listItemRight}>
                    {fetchingStatus === ManifestFetchStatus.FETCHING &&
                    status === Status.FETCHING ? (
                      <ReactLoaderSpinner
                        type="ThreeDots"
                        width={40}
                        heigt={40}
                      />
                    ) : fetchingStatus === ManifestFetchStatus.FETCHING &&
                    status === Status.RATELIMIT ? (
                      <Typography>Resuming soon...</Typography>
                    ) : fetchingStatus === ManifestFetchStatus.DONE ? (
                      <CheckCircle color="secondary" />
                    ) : fetchingStatus === ManifestFetchStatus.WAITING ? (
                      <Typography>Waiting...</Typography>
                    ) : fetchingStatus === ManifestFetchStatus.ERROR ? (
                      <Error color="error" />
                    ) : fetchingStatus === ManifestFetchStatus.NOT_FOUND ? (
                      <Typography>Not Found</Typography>
                    ) : (
                      <></>
                    )}
                  </ListItemSecondaryAction>
                  <ScrollToBottom
                    condition={() =>
                      fetchingStatus === ManifestFetchStatus.FETCHING
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </div>
      </Paper>
    );
  };
}

export default withStyles(styles)(FetchManifests);
