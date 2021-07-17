import React from 'react';
import { Formik } from 'formik';

// Custom UIs
import EventField from './EventField';

// Bootstrap Components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class CompMakingForm extends React.Component {
  render() {
    return (
      <>
        <Formik
          initialValues={{
            name: '',
            desc: '',
            events: [],
            date: { start: '', end: '' },
            regDate: { start: '', end: '' },
          }}
          validate={(values) => {
            const errors = {};

            if (!values.name) {
              errors.name = '대회 이름을 입력해주세요.';
            }
            if (values.events.length === 0) {
              errors.events = '하나 이상의 경연 대회를 추가해주세요.';
            }

            return errors;
          }}
          onSubmit={(e) => {
            console.log(e);
          }}
        >
          {({
            values,
            touched,
            errors,
            submitCount,
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

                    if (submitCount) setFieldTouched('events', true);
                    setFieldValue('events', events);
                  }}
                  isInvalid={touched.events && errors.events}
                  msgForInvalid={errors.events}
                />
              </Form.Group>
              <Row>
                <Col lg>
                  <Form.Group controlId="compDateStart">
                    <Form.Label>경연 대회 시작일</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      {...getFieldProps('date.start')}
                    />
                  </Form.Group>
                </Col>
                <Col lg>
                  <Form.Group controlId="compDateEnd">
                    <Form.Label>경연 대회 종료일</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      {...getFieldProps('date.end')}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg>
                  <Form.Group controlId="compRegDateStart">
                    <Form.Label>참가 신청 접수 시작일</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      {...getFieldProps('regDate.start')}
                    />
                  </Form.Group>
                </Col>
                <Col lg>
                  <Form.Group controlId="compRegDateEnd">
                    <Form.Label>참가 신청 접수 종료일</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      {...getFieldProps('regDate.end')}
                    />
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
