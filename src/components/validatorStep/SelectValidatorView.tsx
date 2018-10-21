import * as React from "react";
import { createStyles, withStyles, WithStyles } from "../../lib/material-ui";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
// tslint:disable-next-line:import-name
import SearchIcon from "@material-ui/icons/Search";

import SelectableList from "../units/SelectableList";
import CodeText from "../units/CodeText";
import AlertBox, { AlertBoxType } from "../units/AlertBox";
import { IWizardStepProps } from "../layout/Wizard";

const styles = theme =>
  createStyles({
    progress: {},
    paperRoot: {
      width: "100%",
      display: "flex"
    },
    flexChildBox: {
      width: "100%"
    },
    searchBox: {
      position: "relative",
      marginLeft: 0,
      width: "100%",
      backgroundColor: lighten(theme.palette.primary.light, 0.85)
    },
    searchIcon: {
      width: theme.spacing.unit * 3,
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: theme.spacing.unit * 3
    },
    inputRoot: {
      color: "inherit",
      width: "100%",
      padding: 0
    },
    inputInput: {
      width: "100%",
      padding: theme.spacing.unit * 1.5,
      paddingLeft: theme.spacing.unit * 6.5
    }
  });

const applyFilter = (validator: model.IValidatorSelection, filter: string) => {
  return (
    `${validator.validation_public_key}____${validator.domain}`.indexOf(
      filter
    ) >= 0
  );
};

interface Props extends WithStyles<typeof styles>, Partial<IWizardStepProps> {}

interface State {
  items: model.IValidatorSelection[];
  filter: string;
}

class SelectValidatorView extends React.Component<Props, State> {
  state = {
    items: [],
    filter: ""
  };

  handleFilterChange = (filter: string) => {
    this.setState({
      filter
    });
  };

  handleItemSelect = (validator: model.IValidatorSelection) => {
    const { validators, onReplaceValidator } = this.props;
    const index = validators.findIndex(
      v => v.validation_public_key === validator.validation_public_key
    );
    if (index >= 0) {
      validators[index].isSelected = !validators[index].isSelected;
      onReplaceValidator(index, validators[index]);
    }
  };

  render() {
    const { classes, validators } = this.props;
    const { filter } = this.state;

    const filtered = validators.filter(a => applyFilter(a, filter));
    const unselected = filtered.filter(a => !a.isSelected);
    const selected = validators.filter(a => a.isSelected);

    return (
      <Paper classes={{ root: classes.paperRoot }} elevation={0}>
        <div className={classes.flexChildBox}>
          <div className={classes.searchBox}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Filter by domain or public key…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              onChange={e => this.handleFilterChange(e.target.value)}
              value={filter}
            />
          </div>
          <SelectableList
            items={unselected}
            primaryRenderer={item => item.domain}
            secondaryRenderer={item => (
              <CodeText text={item.validation_public_key} />
            )}
            onItemSelected={this.handleItemSelect}
            width={innerWidth}
            height={400}
          />
        </div>
        <div className={classes.flexChildBox}>
          <AlertBox
            color={selected.length > 0 ? AlertBoxType.GREEN : undefined}
          >
            {selected.length > 0
              ? `${selected.length} validator(s) selected`
              : `No validators selected`}
          </AlertBox>
          <SelectableList
            items={selected}
            primaryRenderer={item => item.domain}
            secondaryRenderer={item => (
              <CodeText text={item.validation_public_key} />
            )}
            onItemSelected={this.handleItemSelect}
            width={innerWidth}
            height={400}
          />
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(SelectValidatorView);
