import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import CompetitionList from '../components/CompetitionList';
import CompetitionForm from '../forms/CompetitionForm';

export default function CompetitionManagement() {
  const [competitions, setCompetitions] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [target, setTarget] = useState(null);

  useEffect(() => {
    async function getCompetitions() {
      const res = await axios.get('/api/competitions');
      setCompetitions(res.data);
    }

    if (!competitions) {
      getCompetitions();
    }
  }, [competitions]);

  const showPatchDialog = async (c) => {
    try {
      const res = await axios.get(`/api/competitions/${c._id}`);
      setTarget(res.data);
      setShowForm(true);
    } catch (err) {
      window.alert(err.response?.data);
    }
  };

  const showDeleteDialog = async (c) => {
    try {
      if (
        window.confirm(
          `정말로 '${c.name}' 라인트레이서 경연 대회 페이지를 삭제하시겠습니까?`,
        )
      ) {
        await axios.delete(`/api/competitions/${c._id}`);
        setCompetitions(null); // reload
      }
    } catch (err) {
      window.alert(err.response?.data);
    }
  };

  return (
    <div>
      <h3>📜 라인트레이서 대회 페이지 목록</h3>
      <p>
        현재 개설된 라인트레이서 대회 페이지 목록입니다. 여기서 페이지를 수정 및
        삭제할 수 있으며, 참가자 목록을 확인할 수 있습니다.
      </p>
      <Button
        className="mb-3"
        onClick={() => {
          setShowForm(true);
          setTarget(null);
        }}
      >
        라인트레이서 대회 페이지 만들기
      </Button>
      <CompetitionList
        data={competitions}
        renderFunction={(c) => (
          <>
            <Button
              as={Link}
              variant="outline-secondary"
              size="sm"
              className="border-0"
              to={`/admin/participants?cid=${c._id}`}
            >
              참가자 목록
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              className="border-0"
              onClick={() => showPatchDialog(c)}
            >
              수정
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              className="border-0"
              onClick={() => showDeleteDialog(c)}
            >
              삭제
            </Button>
          </>
        )}
      />
      <Modal
        show={showForm}
        onHide={() => setShowForm(false)}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {target
              ? '라인트레이서 대회 페이지 수정'
              : '라인트레이서 대회 페이지 만들기'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CompetitionForm
            data={target}
            onSubmitted={() => {
              setCompetitions(null); // reload
              setShowForm(false); // close
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
