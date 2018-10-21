import * as React from "react";
import { Formik, FormikErrors, FieldArray } from "formik";
import * as Yup from "yup";
import { createStyles, withStyles, WithStyles } from "../../lib/material-ui";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import StepConnector from "@material-ui/core/StepConnector";

const styles = theme =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },
    button: {
      marginRight: theme.spacing.unit
    },
    instructions: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit
    },
    stepTitle: {
      textAlign: "center",
      marginBottom: theme.spacing.unit * 2
    },
    connectorActive: {
      "& $connectorLine": {
        borderColor: theme.palette.secondary.main
      }
    },
    connectorCompleted: {
      "& $connectorLine": {
        borderColor: theme.palette.primary.main
      }
    },
    connectorDisabled: {
      "& $connectorLine": {
        borderColor: theme.palette.grey[100]
      }
    },
    connectorLine: {
      transition: theme.transitions.create("border-color")
    },
    stepButtonBox: {
      marginTop: theme.spacing.unit * 2,
      display: "flex",
      justifyContent: "flex-end"
    }
  });

const getValidationSchema = (
  steps: IWizardStep[],
  values: store.WizardState
) => {
  const schemaShapes = steps.reduce((prev, curr, i) => {
    if (curr.validation && curr.validation.createObjectSchema) {
      prev[curr.validation.target] = Yup.object().when("activeStep", {
        is: i,
        then: curr.validation.createObjectSchema(values)
      });
    }
    if (curr.validation && curr.validation.createArraySchema) {
      prev[curr.validation.target] = Yup.array().when("activeStep", {
        is: i,
        then: curr.validation.createArraySchema(values)
      });
    }
    return prev;
  }, {});

  return Yup.object().shape({
    activeStep: Yup.number(),
    ...schemaShapes
  });
};

export interface IWizardStepProps {
  validators: model.IValidatorSelection[];
  publisher: model.IPublisherInfo;
  manifestFetchResults: model.IManifestFetchResult[];
  errors: any;
  onChange: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  onReplaceValidator: (i, item) => void;
  onPushManifestFetchResult: (item) => void;
}

export interface IWizardStep {
  title: string;
  component: (props: IWizardStepProps) => JSX.Element;
  validation?: {
    target: string;
    createObjectSchema?: (values: store.WizardState) => Yup.ObjectSchema<any>;
    createArraySchema?: (values: store.WizardState) => Yup.ArraySchema<any>;
  };
}

interface Props extends WithStyles<typeof styles> {
  initialValues: store.WizardState;
  steps: IWizardStep[];
}

class Wizard extends React.Component<Props, any> {
  state = {
    activeStep: 0
  };

  componentDidMount = () => {};

  handleNext = (setFieldValue: any) => {
    this.setState(state => {
      setFieldValue("activeStep", state.activeStep + 1);
      return {
        activeStep: state.activeStep + 1
      };
    });
  };

  handleBack = (setFieldValue: any) => {
    this.setState(state => {
      setFieldValue("activeStep", state.activeStep - 1);
      return {
        activeStep: state.activeStep - 1
      };
    });
  };

  render() {
    const { classes, initialValues, steps } = this.props;
    const { activeStep } = this.state;

    if (!initialValues.validators || initialValues.validators.length === 0) {
      return <></>;
    }

    const currentStep = steps[activeStep];
    const schema = getValidationSchema(steps, initialValues);

    return (
      <div className={classes.root}>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={
            <StepConnector
              classes={{
                active: classes.connectorActive,
                completed: classes.connectorCompleted,
                disabled: classes.connectorDisabled,
                line: classes.connectorLine
              }}
            />
          }
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{step.title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Formik
          initialValues={{ ...initialValues, activeStep }}
          onSubmit={() => undefined}
          validationSchema={schema}
          render={({
            values,
            errors,
            validateForm,
            setFieldValue,
            handleChange
          }) => (
            <form>
              <FieldArray
                name="validators"
                render={validatorArrayHelpers => (
                  <FieldArray
                    name="manifestFetchResults"
                    render={manifestFetchResultsArrayHelpers =>
                      currentStep.component({
                        errors,
                        setFieldValue,
                        validators: values.validators,
                        publisher: values.publisher,
                        manifestFetchResults: values.manifestFetchResults,
                        onChange: handleChange,
                        onReplaceValidator: (i, item) =>
                          validatorArrayHelpers.replace(i, item),
                        onPushManifestFetchResult: item =>
                          manifestFetchResultsArrayHelpers.push(item)
                      })
                    }
                  />
                )}
              />
              <div className={classes.stepButtonBox}>
                {activeStep !== 0 && (
                  <Button
                    onClick={() => this.handleBack(setFieldValue)}
                    className={classes.button}
                    variant="outlined"
                  >
                    Back
                  </Button>
                )}
                {activeStep !== steps.length - 1 && (
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={Object.keys(errors).length > 0}
                    onClick={() =>
                      validateForm().then(
                        (errors: FormikErrors<store.WizardState>) => {
                          if (Object.keys(errors).length === 0) {
                            this.handleNext(setFieldValue);
                          }
                        }
                      )
                    }
                    className={classes.button}
                  >
                    Next
                  </Button>
                )}
              </div>
            </form>
          )}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Wizard);
