import React from 'react';
import axios from 'axios';

import CompetitionView from '../components/CompetitionView';

class Competition extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;

    if (!this.state.data) {
      axios
        .get(`/api/competitions/${id}`)
        .then((value) => {
          const data = { ...value.data };
          this.setState({ data });
        })
        .catch((err) => {
          alert(err);
        });
    }
  }

  render() {
    return this.state.data ? <CompetitionView data={this.state.data} /> : null;
  }
}

export default Competition;
