import React from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';

import CompetitionView from '../components/CompetitionView';
import PageNotFound from '../components/PageNotFound';

class Competition extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      isDataLoaded: false,
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;

    if (!this.state.isDataLoaded) {
      let data = null;
      axios
        // get competition information for id
        .get(`/api/competitions/${id}`)
        .then((value) => {
          data = { ...value.data };
        })
        .catch(console.error)
        .finally(() => this.setState({ data, isDataLoaded: true }));
    }
  }

  handleDeleteCompetition = () => {
    const { history } = this.props;
    const { _id } = this.state.data;

    axios
      // delete competition db
      .delete(`/api/competitions/${_id}`)
      // delete competition poster
      .then(() => axios.delete(`/files/posters/${_id}`))
      .then(() => {
        alert('대회 페이지를 삭제했습니다.');
        history.push('/');
      })
      .catch(console.error);
  };

  render() {
    const { data, isDataLoaded } = this.state;

    return (
      <>
        {isDataLoaded ? (
          data ? (
            <>
              <CompetitionView data={data} />
              <div className="fixed-bottom w-100 bg-light border-top">
                <div className="container p-3">
                  <div className="text-right">
                    <Button
                      variant="danger"
                      onClick={this.handleDeleteCompetition}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <PageNotFound />
          )
        ) : null}
      </>
    );
  }
}

export default Competition;
