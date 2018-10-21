import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { fetchValidators } from "../store/actions";

import Layout from "../hoc/Layout";
import Wizard from "../components/layout/Wizard";
import SelectValidatorView from "../components/validatorStep/SelectValidatorView";
import ValidatorStepDefinition from "../components/validatorStep/ValidatorStepDefinition";
import PublisherView from "../components/publisherStep/PublisherView";
import PublisherStepDefinition from "../components/publisherStep/PublisherStepDefinition";
import FetchManifestsView from "../components/manifestStep/FetchManifestsView";
import ManifestStepDefinition from "../components/manifestStep/ManifestStepDefinition";
import GenerateView from "../components/generateStep/GenerateView";
import GenerateStepDefinition from "../components/generateStep/GenerateStepDefinition";

interface DispatchToProps {
  fetchValidators: () => void;
}

interface Props {
  builder: store.WizardState;
  isLoading: boolean;
}

interface State {}

class Builder extends React.Component<Props & DispatchToProps, State> {
  state = {};

  componentDidMount = () => {
    this.props.fetchValidators();
  };

  render = () => {
    const { builder, isLoading } = this.props;
    const formState = { ...builder };
    const title = "Unique Node List Builder";

    return (
      <Layout title={title} isLoading={isLoading}>
        <Wizard
          initialValues={formState}
          steps={[
            {
              ...PublisherStepDefinition,
              component: props => <PublisherView {...props} />
            },
            {
              ...ValidatorStepDefinition,
              component: props => <SelectValidatorView {...props} />
            },
            {
              ...ManifestStepDefinition,
              component: props => <FetchManifestsView {...props} />
            },
            {
              ...GenerateStepDefinition,
              component: props => <GenerateView {...props} />
            }
          ]}
        />
      </Layout>
    );
  };
}

const mapStateToProps = (state: store.RootState) => ({
  builder: state.builder,
  isLoading: state.builder.validators.length === 0
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  ({
    fetchValidators: () => dispatch(fetchValidators())
  } as DispatchToProps);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Builder);
