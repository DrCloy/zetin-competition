import React from 'react';
import { Formik } from 'formik';

// Custom UIs
import EventField from './EventField';

// Bootstrap Components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class CompMakingForm extends React.Component {
  render() {
    return (
      <>
        <h2>대회 페이지 개설</h2>
        <Formik
          initialValues={{
            name: '',
            desc: '',
            events: [],
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
            handleSubmit,
            handleChange,
            values,
            touched,
            errors,
            submitCount,
            setFieldValue,
            setFieldTouched,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group controlId="compName">
                <Form.Label>이름</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  isInvalid={touched.name && errors.name}
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
                  name="desc"
                  value={values.desc}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="compEvents">
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
              <Button type="submit">개설</Button>
            </Form>
          )}
        </Formik>
      </>
    );
  }
}

export default CompMakingForm;
