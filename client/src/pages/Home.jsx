import React from 'react';
import axios from 'axios';

import CompetitionCardView from '../components/CompetitionCardView';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      competitions: [],
      loaded: false,
      error: '',
    };
  }

  componentDidMount() {
    axios
      .get('/api/competitions')
      .then((res) => {
        const competitions = res.data.slice();
        this.setState({ competitions, loaded: true });
      })
      .catch((err) => {
        this.setState({ error: 'Failed to get competitions' });
      });
  }

  render() {
    return (
      <>
        <h2 className="my-4 text-center">{this.props.title}</h2>
        {this.state.loaded ? (
          <CompetitionCardView data={this.state.competitions} />
        ) : null}
      </>
    );
  }
}

export default Home;
