import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class LinetracerCompEntryForm extends React.Component {
  render() {
    return (
      <Form>
        <h2 className="text-center">{this.props.compName ?? '대회 참가하기'}</h2>
        <h3>인적 사항</h3>
        <p className="text-muted">참가자의 정보를 입력해주세요.</p>
        <Form.Group controlId="formName">
          <Form.Label>이름</Form.Label>
          <Form.Control type="name" />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>이메일</Form.Label>
          <Form.Control type="email" />
          <Form.Text className="text-muted">이메일은 대회의 안내 사항을 전하는데 사용됩니다.</Form.Text>
        </Form.Group>
        <Form.Group controlId="formTeam">
          <Form.Label>소속</Form.Label>
          <Form.Control type="text" />
        </Form.Group>
        <hr />
        <h3>로봇 정보</h3>
        <p className="text-muted">로봇에 대한 정보를 입력해주세요.</p>
        <Form.Group controlId="formRobotName">
          <Form.Label>로봇 이름</Form.Label>
          <Form.Control type="text" />
        </Form.Group>
        <Form.Group controlId="formCPU">
          <Form.Label>CPU</Form.Label>
          <Form.Control type="text" />
        </Form.Group>
        <Form.Group controlId="formRAM">
          <Form.Label>RAM</Form.Label>
          <Form.Control type="text" placeholder="" />
        </Form.Group>
        <Form.Group controlId="formROM">
          <Form.Label>ROM</Form.Label>
          <Form.Control type="text" placeholder="" />
        </Form.Group>
        <Form.Group controlId="formMotor">
          <Form.Label>Motor</Form.Label>
          <Form.Control type="text" placeholder="" />
        </Form.Group>
        <Form.Group controlId="formMotorDriver">
          <Form.Label>Motor Driver</Form.Label>
          <Form.Control type="text" placeholder="" />
        </Form.Group>
        <Form.Group controlId="formADC">
          <Form.Label>ADC</Form.Label>
          <Form.Control type="text" placeholder="" />
        </Form.Group>
        <Form.Group controlId="formSensor">
          <Form.Label>Sensor</Form.Label>
          <Form.Control type="text" placeholder="" />
        </Form.Group>
        <hr />
        <h3>참가 정보</h3>
        <p className="text-muted">대회에 참가할 방식을 선택해주세요.</p>
        <Form.Group controlId="formEntryType">
          <Form.Label>참가 부문</Form.Label>
          <Form.Control as="select" defaultValue="">
            <option>freshman</option>
            <option>expert</option>
            <option>senior</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formOrder">
          <Form.Label>참가 순번</Form.Label>
          <Form.Control type="number" />
        </Form.Group>
        <Form.Group controlId="formComment">
          <Form.Label>하고 싶은 말</Form.Label>
          <Form.Control type="text" />
        </Form.Group>
        <Button variant="primary" type="submit">제출</Button>
      </Form>
    );
  }
}

export default LinetracerCompEntryForm;