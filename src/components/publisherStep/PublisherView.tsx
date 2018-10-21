import * as React from "react";
import { DateTime } from "luxon";

import { createStyles, withStyles, WithStyles } from "../../lib/material-ui";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import DateTimePicker from "material-ui-pickers/DateTimePicker";
import CalendarToday from "@material-ui/icons/CalendarToday";
import AccessTime from "@material-ui/icons/AccessTime";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
// DateTime picker
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
// tslint:disable-next-line:import-name
import LuxonUtils from "material-ui-pickers/utils/luxon-utils";
import FlashOn from "@material-ui/icons/FlashOn";
import Tooltip from "@material-ui/core/Tooltip";
import AlertBox, { AlertBoxType } from "../units/AlertBox";

import * as UnlBuilder from "../../lib/unl-builder";
import { IWizardStepProps } from "../layout/Wizard";
import config from "../../lib/config";

const styles = theme =>
  createStyles({
    spacer: {
      marginBottom: theme.spacing.unit * 2
    },
    generateSeedButton: {
      width: 100
    }
  });

interface Props extends WithStyles<typeof styles>, Partial<IWizardStepProps> {}

interface State {}

const hasError = (errors, field) =>
  !!errors && !!errors.publisher && !!errors.publisher[field];

const PublisherTextField = ({
  required,
  label,
  fieldName,
  type = "",
  value,
  errors,
  setFieldValue,
  endAdornment = undefined,
  code = false
}) => (
  <TextField
    required={required}
    id={fieldName}
    name={`publisher.${fieldName}`}
    label={label}
    type={type}
    value={value}
    onChange={e => setFieldValue(`publisher.${fieldName}`, e.target.value)}
    variant="filled"
    InputProps={{
      endAdornment,
      style: { fontFamily: code ? "'Source Code Pro'" : undefined }
    }}
    FormHelperTextProps={{
      error: hasError(errors, fieldName)
    }}
    helperText={hasError(errors, fieldName) && errors.publisher[fieldName]}
    fullWidth
  />
);

const PublisherDateTimeField = ({
  required,
  label,
  fieldName,
  value,
  setFieldValue,
  errors
}) => (
  <MuiPickersUtilsProvider utils={LuxonUtils}>
    <DateTimePicker
      required={required}
      autoOk
      name={`publisher.${fieldName}`}
      leftArrowIcon={<KeyboardArrowLeft />}
      rightArrowIcon={<KeyboardArrowRight />}
      dateRangeIcon={<CalendarToday />}
      timeIcon={<AccessTime />}
      ampm={false}
      format="MM/dd/yyyy, hh:mm '(UTC)'"
      disablePast
      FormHelperTextProps={{
        error: hasError(errors, fieldName)
      }}
      helperText={hasError(errors, fieldName) && errors.publisher[fieldName]}
      value={value}
      onChange={(value: DateTime) => {
        setFieldValue(`publisher.${fieldName}`, value.toJSDate());
      }}
      label={label}
      variant="filled"
      fullWidth
    />
  </MuiPickersUtilsProvider>
);

class PublisherView extends React.Component<Props, State> {
  handleGenerateSeeds = (seedField: string) => {
    const { setFieldValue } = this.props;
    const seed = UnlBuilder.generateSeed();
    setFieldValue(`publisher.${seedField}`, seed);
  };

  render = () => {
    const { classes, publisher, setFieldValue, errors } = this.props;

    const getAdornment = (field: string) => (
      <InputAdornment position="end">
        <Tooltip title="Generate a random seed">
          <IconButton
            aria-label="Generate a random seed"
            onClick={() => this.handleGenerateSeeds(field)}
          >
            <FlashOn />
          </IconButton>
        </Tooltip>
      </InputAdornment>
    );

    return (
      <>
        {config.demo && (
          <>
            <AlertBox color={AlertBoxType.ORANGE} bordered>
              <Typography style={{ fontWeight: "bold" }}>
                THIS IS A DEMO SITE.
              </Typography>
              <Typography>
                It is highly recommended that you run this app locally by
                downloading the source fom GitHub, as building a UNL requires
                sensitive information such as <strong>master key</strong> and{" "}
                <strong>signing (aka ephemeral) key</strong> seeds.
              </Typography>
            </AlertBox>
            <div className={classes.spacer} />
          </>
        )}
        <Grid container spacing={24}>
          <Grid item xs={12} sm={4}>
            <PublisherTextField
              required
              fieldName="sequence"
              label="Sequence"
              type="number"
              value={publisher.sequence}
              setFieldValue={setFieldValue}
              errors={errors}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <PublisherTextField
              required
              fieldName="version"
              label="Version"
              type="number"
              value={publisher.version}
              setFieldValue={setFieldValue}
              errors={errors}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <PublisherDateTimeField
              required
              fieldName="expiration"
              label="Expiration Date and Time"
              value={publisher.expiration}
              setFieldValue={setFieldValue}
              errors={errors}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <PublisherTextField
              required
              fieldName="seed"
              label="Master Key Seed"
              value={publisher.seed}
              setFieldValue={setFieldValue}
              code={true}
              errors={errors}
              endAdornment={getAdornment("seed")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <PublisherTextField
              required
              fieldName="signingSeed"
              label="Signing Key Seed"
              value={publisher.signingSeed}
              setFieldValue={setFieldValue}
              code={true}
              errors={errors}
              endAdornment={getAdornment("signingSeed")}
            />
          </Grid>
        </Grid>
      </>
    );
  };
}

export default withStyles(styles)(PublisherView);
