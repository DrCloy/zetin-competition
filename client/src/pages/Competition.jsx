import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import CompetitionView from '../components/CompetitionView';
import CompetitionForm from '../forms/CompetitionForm/CompetitionForm';
import PageNotFound from '../components/PageNotFound';

function Competition() {
  const [competition, setCompetition] = useState(null);
  const [isError, setIsError] = useState(false);
  const [showEditingModal, setShowEditingModal] = useState(false);

  const { id } = useParams();
  const history = useHistory();

  // get the competition document correspond to the id
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/competitions/${id}`);
        setCompetition(data);
      } catch (err) {
        setCompetition(null);
        setIsError(true);
      }
    })();
  }, [id]);

  // delete the competition document
  const handleDeleteCompetition = () => {
    (async () => {
      try {
        const { data } = await axios.delete(`/api/competitions/${id}`);
        if (data.posterId) {
          await axios.delete(`/api/files/${data.posterId}`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        history.push('/');
      }
    })();
  };

  return (
    <>
      {competition !== null ? (
        <>
          <CompetitionView data={competition} />
          <div className="fixed-bottom w-100 bg-light border-top">
            <div className="container p-3 text-right">
              <Button
                variant="primary"
                onClick={() => setShowEditingModal(true)}
              >
                수정
              </Button>{' '}
              <Button variant="danger" onClick={handleDeleteCompetition}>
                삭제
              </Button>
            </div>
          </div>
          <Modal
            size="lg"
            show={showEditingModal}
            onHide={() => setShowEditingModal(false)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>경연 대회 페이지 수정</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CompetitionForm competition={competition} />
            </Modal.Body>
          </Modal>
        </>
      ) : isError ? (
        <PageNotFound />
      ) : null}
    </>
  );
}

export default Competition;
