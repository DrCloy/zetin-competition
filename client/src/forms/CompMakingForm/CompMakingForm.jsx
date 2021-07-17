import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Custom UIs
import EventField from './EventField';

// Bootstrap Components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class CompMakingForm extends React.Component {
  schema = Yup.object().shape({
    name: Yup.string().required('대회 이름을 입력해주세요.'),
    desc: Yup.string(),
    events: Yup.array().min(1, '하나 이상의 경연 대회를 추가해주세요.'),
    date: Yup.string().required('대회 실시 날짜를 입력해주세요.'),
    regDateStart: Yup.string().required(
      '참가 신청 접수 시작일을 입력해주세요.',
    ),
    regDateEnd: Yup.string().required('참가 신청 접수 종료일을 입력해주세요.'),
  });

  render() {
    return (
      <>
        <Formik
          initialValues={{
            name: '',
            desc: '',
            events: [],
            date: '',
            regDateStart: '',
            regDateEnd: '',
          }}
          validationSchema={this.schema}
          onSubmit={(e) => {
            console.log(e);
          }}
        >
          {({
            values,
            touched,
            errors,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            getFieldProps,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group controlId="compName">
                <Form.Label>이름</Form.Label>
                <Form.Control
                  type="text"
                  isInvalid={touched.name && errors.name}
                  {...getFieldProps('name')}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="compDesc">
                <Form.Label>설명</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="4"
                  {...getFieldProps('desc')}
                />
              </Form.Group>
              <Form.Group controlId="compEvents" className="clearfix">
                <Form.Label>경연 부문</Form.Label>
                <EventField
                  events={values.events}
                  onChange={(e) => {
                    const idx = e.index;
                    const evt = e.event;
                    const events = values.events.slice();

                    if (evt === null) {
                      events.splice(idx, 1); // delete
                    } else {
                      if (idx === -1) {
                        events.push({ ...evt }); // add
                      } else {
                        events.splice(idx, 1, { ...evt }); // edit
                      }
                    }

                    setFieldTouched('events', true);
                    setFieldValue('events', events);
                  }}
                  isInvalid={touched.events && errors.events}
                  msgForInvalid={errors.events}
                />
              </Form.Group>
              <Row>
                <Col lg>
                  <Form.Group controlId="compRegDateStart">
                    <Form.Label>참가 신청 접수 시작일</Form.Label>
                    <Form.Control
                      type="date"
                      max={values.regDateEnd}
                      isInvalid={touched.regDateStart && errors.regDateStart}
                      {...getFieldProps('regDateStart')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.regDateStart}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      대회 참가 신청 페이지가 입력한 날짜에 자동으로 열립니다.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col lg>
                  <Form.Group controlId="compRegDateEnd">
                    <Form.Label>참가 신청 접수 종료일</Form.Label>
                    <Form.Control
                      type="date"
                      min={values.regDateStart}
                      disabled={!values.regDateStart}
                      isInvalid={touched.regDateEnd && errors.regDateEnd}
                      {...getFieldProps('regDateEnd')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.regDateEnd}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col lg>
                  <Form.Group controlId="compDate">
                    <Form.Label>대회 개최일</Form.Label>
                    <Form.Control
                      type="date"
                      min={values.regDateEnd}
                      disabled={!values.regDateEnd}
                      isInvalid={touched.date && errors.date}
                      {...getFieldProps('date')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.date}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit">개설</Button>
            </Form>
          )}
        </Formik>
      </>
    );
  }
}

export default CompMakingForm;
