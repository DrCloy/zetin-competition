import React from 'react';
import axios from 'axios';

import RuleMakingForm from '../forms/RuleMakingForm';

class Rule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rules: [],
      loaded: false,
      error: '',
    };
  }

  componentDidMount() {
    axios
      .get('/api/rules')
      .then((res) => {
        const rules = res.data.slice();
        this.setState({ rules, loaded: true });
      })
      .catch((err) => {
        this.setState({ error: 'Failed to get competitions' });
      });
  }

  render() {
    return (
      <>
        <h2 className="my-4 text-center">대회 규정 만들기</h2>
        <RuleMakingForm />
      </>
    );
  }
}

export default Rule;
