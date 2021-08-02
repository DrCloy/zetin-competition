import React from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import CompetitionView from '../components/CompetitionView';
import CompetitionForm from '../forms/CompetitionForm/CompetitionForm';
import PageNotFound from '../components/PageNotFound';

class Competition extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      isDataLoaded: false,
      showEditingModal: false,
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

  handleCloseModal = () => {
    this.setState({ showEditingModal: false });
  };

  render() {
    const { data, isDataLoaded, showEditingModal } = this.state;

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
                      variant="primary"
                      onClick={() => {
                        this.setState({ showEditingModal: true });
                      }}
                    >
                      수정
                    </Button>{' '}
                    <Button
                      variant="danger"
                      onClick={this.handleDeleteCompetition}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
              <Modal
                size="lg"
                show={showEditingModal}
                onHide={this.handleCloseModal}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>경연 대회 페이지 수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <CompetitionForm competition={data} />
                </Modal.Body>
              </Modal>
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
