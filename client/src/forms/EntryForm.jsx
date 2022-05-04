import { useState, useEffect } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

/*
 * Input component using react-hook-form and react-bootstrap
 * Required Props: id: string, name: string
 */
function Input(props) {
  const { id, label, name, advice, children, ...restProps } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message;

  return (
    <Form.Group controlId={id}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control {...restProps} {...register(name)} isInvalid={error}>
        {children}
      </Form.Control>
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      {advice && <Form.Text className="text-muted">{advice}</Form.Text>}
    </Form.Group>
  );
}

const schema = yup.object({
  _eventId: yup.string().required('참가 부문을 선택해주세요.'),
  name: yup.string().required('이름을 입력해주세요.'),
  email: yup
    .string()
    .required('이메일을 입력해주세요.')
    .email('이메일 형식이 올바르지 않습니다.'),
  robotName: yup.string().required('로봇의 이름을 입력해주세요.'),
  entryOrder: yup.string().required('참가 순번을 입력해주세요.'),
  newPasswordCheck: yup
    .string()
    .test(
      'isEqualToNewPassword',
      '입력한 비밀번호가 서로 일치하지 않습니다.',
      (value, context) => value === context.parent.newPassword,
    ),
});

export default function EntryRHF(props) {
  const { competition, data, auth, onSubmitted } = props;
  const form = useForm({ mode: 'onBlur', resolver: yupResolver(schema) });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = form;
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmit = async (values) => {
    let response = null;

    try {
      // restruct to fit the backend server
      values._competitionId = competition._id;
      if (!values.password) delete values.password;

      if (data) {
        response = await axios.patch(`/api/participants/${data._id}`, values, {
          headers: { authorization: auth },
        });
      } else {
        response = await axios.post(`/api/participants`, values);
      }

      setErrorMessage(null);
      onSubmitted(response);
    } catch (err) {
      setErrorMessage(err.response.data);
    }
  };

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  return (
    <FormProvider {...form}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <h3>인적 사항</h3>
        <p className="text-muted">참가자의 정보를 입력해주세요.</p>
        <Row xs={1} md={2}>
          <Col>
            <Input type="text" label="이름" name="name" id="entryName" />
          </Col>
          <Col>
            <Input type="email" label="이메일" name="email" id="entryEmail" />
          </Col>
        </Row>
        <Row xs={1}>
          <Col>
            <Input type="text" label="소속" name="team" id="entryTeam" />
          </Col>
        </Row>
        <hr />
        <h3>로봇 정보</h3>
        <p className="text-muted">로봇에 대한 정보를 입력해주세요.</p>
        <Row xs={1}>
          <Col>
            <Input
              type="text"
              label="로봇 이름"
              name="robotName"
              id="entryRobotName"
            />
          </Col>
        </Row>
        <Row xs={1} md={3}>
          <Col>
            <Input type="text" label="CPU" name="robotCPU" id="entryRobotCPU" />
          </Col>
          <Col>
            <Input type="text" label="ROM" name="robotROM" id="entryRobotROM" />
          </Col>
          <Col>
            <Input type="text" label="RAM" name="robotRAM" id="entryRobotRAM" />
          </Col>
        </Row>
        <Row xs={1} md={2}>
          <Col>
            <Input
              type="text"
              label="Motor Driver"
              name="robotMotorDriver"
              id="entryRobotMotorDriver"
            />
          </Col>
          <Col>
            <Input
              type="text"
              label="Motor"
              name="robotMotor"
              id="entryRobotMotor"
            />
          </Col>
        </Row>
        <Row xs={1} md={2}>
          <Col>
            <Input type="text" label="ADC" name="robotADC" id="entryRobotADC" />
          </Col>
          <Col>
            <Input
              type="text"
              label="Sensor"
              name="robotSensor"
              id="entryRobotSensor"
            />
          </Col>
        </Row>
        <hr />
        <h3>참가 정보</h3>
        <p className="text-muted">대회에 참가할 방식을 선택해주세요.</p>
        <Row xs={1} md={2}>
          <Col>
            <Input
              as="select"
              label="참가 부문"
              name="_eventId"
              id="entryEventId"
            >
              <option key="" value="">
                선택
              </option>
              {competition &&
                competition.events.map((event) => (
                  <option
                    key={event._id}
                    value={event._id}
                  >{`${event.name} (${event.numb})`}</option>
                ))}
            </Input>
          </Col>
          <Col>
            <Input
              type="number"
              label="참가 순번"
              min={1}
              name="entryOrder"
              id="entryEntryOrder"
            />
          </Col>
        </Row>
        <Row xs={1}>
          <Col>
            <Input
              as="textarea"
              label="하고 싶은 말"
              name="comment"
              id="entryComment"
            />
          </Col>
        </Row>
        <hr />
        <h3>참가자 인증 수단</h3>
        <p className="text-muted">
          참가자 본인을 식별할 비밀번호를 입력해주세요.
        </p>
        <Row xs={1} md={2}>
          <Col>
            <Input
              type="password"
              label="새 비밀번호"
              name="password"
              id="entryPassword"
            />
          </Col>
          <Col>
            <Input
              type="password"
              label="새 비밀번호 확인"
              name="passwordCheck"
              id="entryPasswordCheck"
            />
          </Col>
        </Row>
        <Button type="submit" disabled={isSubmitting}>
          참가 신청
        </Button>
        <div className="d-inline text-danger ml-2">{errorMessage}</div>
      </Form>
    </FormProvider>
  );
}
