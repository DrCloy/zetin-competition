/* Dependencies */
import React, { useState, useEffect } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import axios from 'axios';

/* Field & Input Components */
import MarkdownField from './fields/MarkdownField';
import NumberField from './fields/NumberField';
import SelectField from './fields/SelectField';
import TextField from './fields/TextField';

/* Bootstrap Components */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import FormikPreviewButton from './utils/FormikPreviewButton';

// initial form values
const initialValues = {
  eventId: '',
  name: '',
  email: '',
  team: '',
  robotName: '',
  robotCPU: '',
  robotROM: '',
  robotRAM: '',
  robotMotorDriver: '',
  robotMotor: '',
  robotADC: '',
  robotSensor: '',
  entryOrder: '',
  comment: '',
};

const yupSchema = yup.object({
  name: yup.string().required('이름을 입력해주세요.'),
  email: yup
    .string()
    .required('이메일을 입력해주세요.')
    .email('이메일 형식이 올바르지 않습니다.'),
  robotName: yup.string().required('로봇의 이름을 입력해주세요.'),
  eventId: yup.string().required('참가 부문을 선택해주세요.'),
  entryOrder: yup.number().required('참가 순번을 입력해주세요.'),
  newPasswordCheck: yup
    .string()
    .test(
      'isEqualToNewPassword',
      '입력한 비밀번호가 서로 일치하지 않습니다.',
      (value, context) => value === context.parent.newPassword,
    ),
});

// EntryForm component
const EntryForm = (props) => {
  const { competition, data, password } = props;

  const history = useHistory();

  const handleSubmit = async (values, formikBag) => {
    let response = null;

    try {
      // for backend spec
      values._eventId = values.eventId;
      delete values.eventId;
      if (values.newPassword) {
        values.password = values.newPassword;
      }
      delete values.newPassword;
      delete values.newPasswordCheck;

      if (competition) {
        values._competitionId = competition._id;
      }

      if (data) {
        response = await axios.patch(`/api/participants/${data._id}`, values, {
          headers: { authorization: `${password}` },
        });
      } else {
        response = await axios.post(`/api/participants`, values);
      }

      history.push(`/participants/${response.data._id}`);
      formikBag.setStatus(undefined);
    } catch (err) {
      console.error(err);
      formikBag.setStatus(err);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yupSchema}
      onSubmit={handleSubmit}
    >
      <Form noValidate>
        <FormikEffect data={data} />
        <h3>인적 사항</h3>
        <p className="text-muted">참가자의 정보를 입력해주세요.</p>
        <Row xs={1} md={2}>
          <Col>
            <TextField label="이름" name="name" controlId="entryName" />
          </Col>
          <Col>
            <TextField label="이메일" name="email" controlId="entryEmail" />
          </Col>
        </Row>
        <Row xs={1}>
          <Col>
            <TextField label="소속" name="team" controlId="entryTeam" />
          </Col>
        </Row>
        <hr />
        <h3>로봇 정보</h3>
        <p className="text-muted">로봇에 대한 정보를 입력해주세요.</p>
        <TextField
          label="로봇 이름"
          name="robotName"
          controlId="entryRobotName"
        />
        <Row xs={1} md={3}>
          <Col>
            <TextField label="CPU" name="robotCPU" controlId="entryRobotCPU" />
          </Col>
          <Col>
            <TextField label="ROM" name="robotROM" controlId="entryRobotROM" />
          </Col>
          <Col>
            <TextField label="RAM" name="robotRAM" controlId="entryRobotRAM" />
          </Col>
        </Row>
        <Row xs={1} md={2}>
          <Col>
            <TextField
              label="Motor Driver"
              name="robotMotorDriver"
              controlId="entryRobotMotorDriver"
            />
          </Col>
          <Col>
            <TextField
              label="Motor"
              name="robotMotor"
              controlId="entryRobotMotor"
            />
          </Col>
        </Row>
        <Row xs={1} md={2}>
          <Col>
            <TextField label="ADC" name="robotADC" controlId="entryRobotADC" />
          </Col>
          <Col>
            <TextField
              label="Sensor"
              name="robotSensor"
              controlId="entryRobotSensor"
            />
          </Col>
        </Row>
        <hr />
        <h3>참가 정보</h3>
        <p className="text-muted">대회에 참가할 방식을 선택해주세요.</p>
        <Row xs={1} md={2}>
          <Col>
            <SelectField
              label="참가 부문"
              name="eventId"
              options={
                competition &&
                competition.events.map((value) => [
                  value._id,
                  `${value.name} (${value.numb})`,
                ])
              }
              controlId="entryEventId"
            />
          </Col>
          <Col>
            <NumberField
              label="참가 순번"
              name="entryOrder"
              controlId="entryEntryOrder"
            />
          </Col>
        </Row>
        <MarkdownField
          label="하고 싶은 말"
          name="comment"
          controlId="entryComment"
        />
        <hr />
        <h3>참가자 인증 수단</h3>
        <p className="text-muted">
          참가자 본인을 식별할 비밀번호를 입력해주세요.
        </p>
        <Row xs={1} md={2}>
          <Col>
            <TextField
              label="새 비밀번호"
              name="newPassword"
              controlId="entryNewPassword"
              password
            />
          </Col>
          <Col>
            <TextField
              label="새 비밀번호 확인"
              name="newPasswordCheck"
              controlId="entryNewPasswordCheck"
              password
            />
          </Col>
        </Row>
        <SubmitButton /> <FormikPreviewButton />
      </Form>
    </Formik>
  );
};

// side effect processing component
const FormikEffect = (props) => {
  const { data } = props;
  const { resetForm } = useFormikContext();

  // side effect for changing competition data
  useEffect(() => {
    const values = { ...initialValues, ...data };
    if (data && data._eventId) {
      values.eventId = data._eventId;
    }
    resetForm({ values });
  }, [data, resetForm]);

  return null;
};

// submit button component (CompetitionForm.jsx에 공통적으로 있는 컴포넌트임.)
const SubmitButton = () => {
  const { submitForm, isSubmitting, isValid, submitCount, status } =
    useFormikContext();
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!!submitCount) {
      if (!isValid) {
        setErrorMessage('입력이 유효하지 않습니다.');
      } else if (status instanceof Error) {
        setErrorMessage(status.message);
      }
    }
  }, [submitCount, isValid, status]);

  return (
    <>
      <Button
        disabled={isSubmitting}
        onClick={!isSubmitting ? submitForm : null}
      >
        {isSubmitting ? '제출 중...' : '제출'}
      </Button>
      {errorMessage ? (
        <p className="text-danger d-inline align-middle">{errorMessage}</p>
      ) : null}
    </>
  );
};

export default EntryForm;
