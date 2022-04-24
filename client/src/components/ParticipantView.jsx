import React from 'react';
import MarkdownIt from 'markdown-it';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

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

  return (
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
    </div>
  );
}

export default ParticipantView;
