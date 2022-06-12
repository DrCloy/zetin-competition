import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ParticipantTable from '../components/ParticipantTable';

export default function ParticipantManagement() {
  const [competitions, setCompetitions] = useState();
  const [targetCompetition, setTargetCompetition] = useState();

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

  useEffect(() => {
    async function getTargetCompetition() {
      try {
        const res = await axios.get(
          `/api/competitions/detail/${competitionId}`,
        );
        setTargetCompetition(res.data);
      } catch (err) {
        alert(err.response?.data);
      }
    }

    if (competitionId) {
      getTargetCompetition();
    } else {
      setTargetCompetition(null);
    }
  }, [competitionId]);

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
                  <Dropdown.Item as="button">수정</Dropdown.Item>
                  <Dropdown.Item as="button">참가 취소</Dropdown.Item>
                </DropdownButton>
              )}
            />
          </div>
        ))}
    </div>
  );
}
