import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Modal from 'react-bootstrap/Modal';
import ParticipantTable from '../components/ParticipantTable';
import EntryForm from '../forms/EntryForm';

export default function ParticipantManagement() {
  const [competitions, setCompetitions] = useState();
  const [targetCompetition, setTargetCompetition] = useState();
  const [targetParticipant, setTargetParticipant] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const competitionId = searchParams.get('cid');

  useEffect(() => {
    async function getCompetitions() {
      try {
        const res = await axios.get('/api/competitions');
        setCompetitions(res.data);
      } catch (err) {
        alert(err.response?.data);
      }
    }

    if (!competitions) {
      getCompetitions();
    }
  }, [competitions]);

  const loadDetailedCompetition = useCallback(async () => {
    const res = await axios.get(`/api/competitions/${competitionId}/detail`);
    setTargetCompetition(res.data);
  }, [competitionId]);

  useEffect(() => {
    try {
      if (competitionId) {
        loadDetailedCompetition();
      } else {
        setTargetCompetition(null);
      }
    } catch (err) {
      alert(err.response?.data);
    }
  }, [competitionId, loadDetailedCompetition]);

  const showParticipantEditDialog = (p) => {
    setTargetParticipant(p);
    setShowForm(true);
  };

  const showUnparticipationDialog = async (p) => {
    try {
      if (window.confirm(`정말로 '${p.name}'의 참가를 취소하시겠습니까?`)) {
        await axios.delete(`/api/participants/${p._id}`);
        loadDetailedCompetition(); // reload
      }
    } catch (err) {
      alert(err.response?.data);
    }
  };

  return (
    <div>
      <h3>👪 대회 참가자 관리</h3>
      <p>
        관리자가 대회 참가자를 수정하거나 삭제할 수 있습니다. 비밀번호를 변경할
        수도 있어서 대회 참가자가 비밀번호를 잊어버렸을 시에 관리자가 임의의
        비밀번호로 설정하여 전달할 수 있습니다.
      </p>
      <Form>
        <Form.Row>
          <Col md={8} lg={6}>
            <Form.Group controlId="selectCompetition">
              <Form.Control
                as="select"
                value={competitionId ? competitionId : ''}
                onChange={(e) => setSearchParams({ cid: e.target.value })}
              >
                <option value="">라인트레이서 대회 선택 ...</option>
                {competitions &&
                  competitions.map((value) => (
                    <option key={value._id} value={value._id}>
                      {value.name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          </Col>
          {targetCompetition && (
            <Col className="text-right">
              <Button
                variant="secondary mr-1"
                onClick={() => {
                  setTargetParticipant(null);
                  setShowForm(true);
                }}
              >
                참가자 등록
              </Button>
              <Button
                variant="secondary"
                href={`/api/competitions/${competitionId}/participants?toCSV=true`}
                target="_blank"
                rel="noreferrer"
              >
                CSV 파일로 내보내기
              </Button>
            </Col>
          )}
        </Form.Row>
      </Form>
      {targetCompetition &&
        targetCompetition.events.map((event) => (
          <div key={event._id}>
            <h5>'{event.name}' 참가자</h5>
            <ParticipantTable
              data={event.participants.filter((p) => p !== null)}
              countPerPage={10}
              renderFunction={(p) => (
                <DropdownButton
                  id="functions"
                  title=""
                  variant="link"
                  size="sm"
                >
                  <Dropdown.Item
                    as="button"
                    onClick={() => showParticipantEditDialog(p)}
                  >
                    수정
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={() => showUnparticipationDialog(p)}
                  >
                    참가 취소
                  </Dropdown.Item>
                </DropdownButton>
              )}
            />
          </div>
        ))}
      <Modal
        show={showForm}
        onHide={() => setShowForm(false)}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>참가자 등록</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EntryForm
            competition={targetCompetition}
            data={targetParticipant}
            onSubmitted={() => {
              loadDetailedCompetition(); // reload
              alert('참가자 등록이 완료됐습니다.');
              setTargetParticipant(null);
              setShowForm(false);
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
