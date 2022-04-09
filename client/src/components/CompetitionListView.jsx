import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import CompetitionForm from '../forms/CompetitionForm';

const formatDate = (str) => moment(str).format('YYYY-MM-DD');
const checkDateTerm = (comp, start, end) => {
  const c = moment(comp);
  const s = moment(start);
  const e = moment(end);

  if (s.diff(c) <= 0 && c.diff(e) <= 0) return true;
  else return false;
};

function CompetitionListView(props) {
  const { token } = props;

  const [competitions, setCompetitions] = useState([]);
  const [deletion, setDeletion] = useState(null);
  const [modification, setModification] = useState(null);

  useEffect(() => {
    if (deletion != null) {
      return;
    }

    (async () => {
      const res = await axios.get('/api/competitions');
      setCompetitions(res.data.slice());
    })();
  }, [deletion, modification]);

  return (
    <ListGroup>
      {competitions.map((comp) => (
        <ListGroup.Item key={comp._id}>
          <div>
            <a
              href={`/competitions/${comp._id}`}
              target="_blank"
              rel="noreferrer"
            >
              <strong>{comp.name}</strong>
            </a>
          </div>
          <div className="text-muted">
            <small>
              <span>📅 대회 날짜: {formatDate(comp.date)}</span>
              <span className="mr-2"></span>
              <span
                className={
                  checkDateTerm(Date.now(), comp.regDateStart, comp.regDateEnd)
                    ? 'text-success'
                    : ''
                }
              >
                ✒️ 접수 기간: {formatDate(comp.regDateStart)}~
                {formatDate(comp.regDateEnd)}
              </span>
            </small>
          </div>
          <div className="float-right">
            <Button variant="outline-secondary" size="sm" className="border-0">
              참가자 목록
            </Button>
            {token ? (
              <>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="border-0"
                  onClick={async () => {
                    const res = await axios.get(
                      `/api/competitions/${comp._id}`,
                    );
                    setModification(res.data);
                  }}
                >
                  수정
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="border-0"
                  onClick={() => setDeletion(comp)}
                >
                  삭제
                </Button>
              </>
            ) : null}
          </div>
        </ListGroup.Item>
      ))}
      {/* Deletion Modal */}
      <Modal show={deletion ? true : false} backdrop="static">
        <Modal.Body>
          정말로 <strong>{deletion && deletion.name}</strong> 페이지를
          삭제하시겠습니까?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeletion(null)}>
            취소
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              await axios.delete(`/api/competitions/${deletion._id}`, {
                headers: { authorization: token },
              });
              setDeletion(null);
            }}
          >
            삭제
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modification Modal */}
      <Modal
        show={modification ? true : false}
        size="lg"
        backdrop="static"
        onHide={() => setModification(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{modification && modification.name} 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CompetitionForm
            token={token}
            data={modification}
            onSubmitSuccess={() => setModification(null)}
          />
        </Modal.Body>
      </Modal>
    </ListGroup>
  );
}

export default CompetitionListView;
