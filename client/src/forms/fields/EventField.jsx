import React, { useState, useRef } from 'react';
import { Formik, Form as FormikForm, useField } from 'formik';
import * as yup from 'yup';

/* Custom UIs */
import TextField from '../fields/TextField';
import NumberField from '../fields/NumberField';

/* Bootstrap Components */
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';

const EventField = (props) => {
  // properties
  const { label, controlId } = props;

  // formik hook
  const [field, meta, helpers] = useField(props.name);
  const { value } = field;
  const { touched, error } = meta;
  const { setTouched, setValue } = helpers;

  // states
  const [targetIndex, setTargetIndex] = useState(-1);
  const [showModModal, setShowModModal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);

  // handlers
  const handleModSubmit = (event) => {
    const events = value.slice();
    if (targetIndex < 0) {
      events.push({ ...event }); // add
    } else {
      events.splice(targetIndex, 1, { ...event }); // modify
    }
    setTouched(true);
    setValue(events);
    setShowModModal(false);
  };
  const handleDelSubmit = () => {
    const events = value.slice();
    events.splice(targetIndex, 1); // delete
    setTouched(true);
    setValue(events);
    setShowDelModal(false);
  };
  const getClickHandler = (index, cbSetShowModalState) => {
    return () => {
      setTargetIndex(index);
      cbSetShowModalState(true);
    };
  };

  // event validation schema
  const eventSchema = yup.object().shape({
    name: yup
      .string()
      .default('')
      .test(
        'is-unique-name',
        '중복된 경연 부문 이름이 존재합니다.',
        (input) => {
          // search for duplicate names
          for (let i = 0; i < value.length; i++) {
            if (i === targetIndex) continue; // don't check itself.
            if (input === value[i].name) return false;
          }
          return true;
        },
      )
      .required('대회 이름을 입력해주세요.'),
    desc: yup.string().default(''),
    numb: yup
      .number()
      .min(1, '참가 인원은 1명 이상이어야 합니다.')
      .required('참가 인원을 입력해주세요.'),
  });

  return (
    <Form.Group controlId={controlId} className="clearfix">
      <Form.Label>{label}</Form.Label>
      <ListGroup className={touched && error ? 'is-invalid' : ''}>
        {value.length ? (
          value.map((item, index) => (
            <ListGroup.Item key={item.name}>
              <div>
                {item.name} ({item.numb})
              </div>
              <div className="text-muted small">{item.desc}</div>
              <div className="float-right">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="border-0"
                  onClick={getClickHandler(index, setShowModModal)}
                >
                  수정
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="border-0 ml-2"
                  onClick={getClickHandler(index, setShowDelModal)}
                >
                  삭제
                </Button>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item className={touched && error ? 'border-danger' : ''}>
            없음
          </ListGroup.Item>
        )}
      </ListGroup>
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      <Button
        variant="secondary"
        size="sm"
        className="float-right mt-2"
        onClick={getClickHandler(-1, setShowModModal)}
      >
        추가
      </Button>
      <EventModModal
        value={targetIndex < 0 ? null : value[targetIndex]}
        validationSchema={eventSchema}
        show={showModModal}
        onSubmit={handleModSubmit}
        onHide={() => setShowModModal(false)}
      />
      <EventDelModal
        value={value[targetIndex]}
        show={showDelModal}
        onSubmit={handleDelSubmit}
        onHide={() => setShowDelModal(false)}
      />
    </Form.Group>
  );
};

/*
< Issues >
- If animation property in Modal Component is true,
  'findDOMNode is deprecated in StrictMode' warning is occured.
  (https://github.com/react-bootstrap/react-bootstrap/issues/5075)
*/
const EventModModal = (props) => {
  const { value, validationSchema, show, onSubmit, onHide } = props;

  const submitInput = useRef();

  return (
    <Modal show={show} onHide={onHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{value ? '경연 부문 수정' : '새 경연 부문'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={value || { name: '', desc: '', numb: 0 }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <FormikForm noValidate>
            <TextField label="이름" name="name" controlId="eventName" />
            <TextField
              label="설명"
              name="desc"
              controlId="eventDesc"
              multiLine
            />
            <NumberField
              label="참가 인원"
              name="numb"
              min="0"
              controlId="eventNumb"
            />
            <input type="submit" className="d-none" ref={submitInput} />
          </FormikForm>
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          취소
        </Button>
        <Button variant="primary" onClick={() => submitInput.current.click()}>
          {value ? '수정' : '추가'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const EventDelModal = (props) => {
  const { value, show, onSubmit, onHide } = props;
  const name = value && value.name;

  return (
    <Modal show={show} onHide={onHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>경연 부문 삭제</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>정말로 '{name}' 경연 부문을 삭제하시겠습니까?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          취소
        </Button>
        <Button variant="danger" onClick={onSubmit}>
          삭제
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventField;
