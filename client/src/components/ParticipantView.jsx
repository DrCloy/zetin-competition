import React, { useState } from 'react';
import MarkdownIt from 'markdown-it';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

import ParticipantAuthForm from '../forms/ParticipantAuthForm';
import EntryForm from '../forms/EntryForm';

function Field(props) {
  const { name, value } = props;

  return value === null ? null : (
    <Row>
      <Col xs={4} className="text-right">
        {name}
      </Col>
      <Col xs={8}>{value}</Col>
    </Row>
  );
}

const md = new MarkdownIt();

function ParticipantView(props) {
  const { participant } = props;
  const {
    _id,
    _competitionId,
    name,
    email,
    team,
    robotName,
    robotCPU,
    robotROM,
    robotRAM,
    robotMotorDriver,
    robotMotor,
    robotADC,
    robotSensor,
    entryOrder,
    comment,
  } = participant;

  const [modification, setModification] = useState(null);
  // react-router-dom 쓰면 더 편할 텐데..
  const [formData, setFormData] = useState(null);
  const history = useHistory();

  return modification ? (
    formData ? (
      <EntryForm
        competition={formData.competition}
        data={formData.data}
        password={formData.password}
      />
    ) : (
      <div>
        <p>{modification.message}</p>
        <ParticipantAuthForm
          participant={participant}
          method={modification.method}
          onSucceed={modification.callback}
          onCancelled={() => setModification(null)}
        />
      </div>
    )
  ) : (
    <div>
      <h4>인적 사항</h4>
      <Field name="이름" value={name} />
      <Field name="이메일" value={email} />
      <Field name="소속" value={team} />
      <h4>로봇 정보</h4>
      <Field name="로봇 이름" value={robotName} />
      <Field name="CPU" value={robotCPU} />
      <Field name="ROM" value={robotROM} />
      <Field name="RAM" value={robotRAM} />
      <Field name="Motor Driver" value={robotMotorDriver} />
      <Field name="Motor" value={robotMotor} />
      <Field name="ADC" value={robotADC} />
      <Field name="Sensor" value={robotSensor} />
      <h4>참가 정보</h4>
      <Field name="참가 부문" />
      <Field name="참가 순번" value={entryOrder} />
      <Field name="실제 순번" />
      {/* 하고 싶은 말은 마크다운으로 보여줘야 함 */}
      <Field
        name="하고 싶은 말"
        value={
          comment && (
            <div dangerouslySetInnerHTML={{ __html: md.render(comment) }}></div>
          )
        }
      />
      <div className="text-right">
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            setModification({
              method: 'PATCH',
              message: '참가 내용을 수정하려면 비밀번호를 입력해주세요.',
              callback: async (data) => {
                const { password } = data;
                const resCompetition = await axios.get(
                  `/api/competitions/${_competitionId}`,
                );
                const resParticipant = await axios.get(
                  `/api/participants/${_id}`,
                  { headers: { Authorization: password } },
                );
                setFormData({
                  competition: resCompetition.data,
                  data: resParticipant.data,
                  password: password,
                });
              },
            })
          }
        >
          수정
        </Button>{' '}
        <Button
          variant="danger"
          size="sm"
          onClick={() =>
            setModification({
              method: 'DELETE',
              message: '참가를 취소하려면 비밀번호를 입력해주세요.',
              callback: async (data) => {
                const { password } = data;
                await axios.delete(`/api/participants/${_id}`, {
                  headers: { Authorization: password },
                });
                history.push(`/`);
              },
            })
          }
        >
          참가 취소
        </Button>
      </div>
    </div>
  );
}

export default ParticipantView;
