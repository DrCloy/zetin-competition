import React from 'react';
import { Formik } from 'formik';

// Bootstrap Components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';

class EventField extends React.Component {
  constructor(props) {
    super(props);

    // State
    this.state = {
      targEvent: null,
      targIndex: -1,
      showModModal: false,
      showDelModal: false,
    };

    // Event handlers
    this.handleEventModSubmit = this.handleEventModSubmit.bind(this);
    this.handleEventDelSubmit = this.handleEventDelSubmit.bind(this);
    this.handleEventModHide = this.handleEventModHide.bind(this);
    this.handleEventDelHide = this.handleEventDelHide.bind(this);
  }

  handleEventModSubmit(e) {
    const value = {
      event: e,
      index: this.state.targIndex,
    };

    this.setState({ showModModal: false }, () => {
      this.props.onChange(value);
    });
  }

  handleEventDelSubmit() {
    const value = {
      event: null, // null value means deletion
      index: this.state.targIndex,
    };

    this.setState({ showDelModal: false }, () => {
      this.props.onChange(value);
    });
  }

  handleEventModHide() {
    this.setState({ showModModal: false });
  }

  handleEventDelHide() {
    this.setState({ showDelModal: false });
  }

  // Validation function for modal form of event modification
  validateEvent = (event) => {
    const events = this.props.events;
    const errors = {};

    // Check name field
    if (event.name === '') {
      errors.name = '대회 이름을 입력해주세요.';
    } else {
      // Search for duplicate names
      for (let i = 0; i < events.length; i++) {
        if (i === this.state.targIndex) continue; // don't check itself.

        if (events[i].name === event.name) {
          errors.name = '중복된 경연 부문 이름이 존재합니다.';
          break;
        }
      }
    }

    // Check numb field
    if (event.numb <= 0) {
      errors.numb = '참가 인원은 1명 이상이어야 합니다.';
    }

    return errors;
  };

  render() {
    const events = this.props.events.map((item, index) => (
      <ListGroup.Item key={item.name} className="pb-2">
        <div>
          {item.name} ({item.numb})
        </div>
        <div className="text-muted small">{item.desc}</div>
        <div className="float-right">
          <Button
            variant="outline-secondary"
            size="sm"
            className="border-0 mr-2"
            onClick={() => {
              this.setState({
                targEvent: item,
                targIndex: index,
                showModModal: true,
              });
            }}
          >
            수정
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            className="border-0"
            onClick={() => {
              this.setState({
                targEvent: item,
                targIndex: index,
                showDelModal: true,
              });
            }}
          >
            삭제
          </Button>
        </div>
      </ListGroup.Item>
    ));

    return (
      <>
        <ListGroup className={this.props.isInvalid ? 'is-invalid' : ''}>
          {events.length ? (
            events
          ) : (
            <ListGroup.Item
              className={this.props.isInvalid ? 'border-danger' : ''}
            >
              없음
            </ListGroup.Item>
          )}
        </ListGroup>
        <div className="invalid-feedback">{this.props.msgForInvalid}</div>
        <Button
          variant="secondary"
          className="float-right mt-2"
          onClick={() => {
            this.setState({
              targEvent: null, // null value means new event (used in modal form)
              targIndex: -1, // number of -1 means new event (used in handler)
              showModModal: true,
            });
          }}
        >
          추가
        </Button>
        <EventModModal
          event={this.state.targEvent}
          show={this.state.showModModal}
          onSubmit={this.handleEventModSubmit}
          onHide={this.handleEventModHide}
          fnValidation={this.validateEvent}
        />
        <EventDelModal
          event={this.state.targEvent}
          show={this.state.showDelModal}
          onSubmit={this.handleEventDelSubmit}
          onHide={this.handleEventDelHide}
        />
      </>
    );
  }
}

/*
< Issues >
- If animation property in Modal Component is true,
  'findDOMNode is deprecated in StrictMode' warning is occured.
  (https://github.com/react-bootstrap/react-bootstrap/issues/5075)
*/

class EventModModal extends React.Component {
  render() {
    return (
      <Formik
        initialValues={{ name: '', desc: '', numb: 0 }}
        validate={(values) => this.props.fnValidation(values)}
        onSubmit={this.props.onSubmit}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          touched,
          errors,
          setValues,
          resetForm,
        }) => (
          <Modal
            show={this.props.show}
            onShow={() => {
              const event = this.props.event;
              if (event) setValues({ ...event });
              else resetForm();
            }}
            onHide={this.props.onHide}
            backdrop="static"
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {this.props.event ? '경연 부문 수정' : '새 경연 부문'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="eventName">
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
                <Form.Group controlId="eventDesc">
                  <Form.Label>설명</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="desc"
                    value={values.desc}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="eventNumb">
                  <Form.Label>참가 인원</Form.Label>
                  <Form.Control
                    type="number"
                    name="numb"
                    value={values.numb}
                    onChange={handleChange}
                    isInvalid={touched.numb && errors.numb}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.numb}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.props.onHide}>
                취소
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                {this.props.event ? '수정' : '추가'}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Formik>
    );
  }
}

class EventDelModal extends React.Component {
  render() {
    const event = this.props.event;
    const name = event ? event.name : '';

    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>경연 부문 삭제</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>정말로 {name} 경연 부문을 삭제하시겠습니까?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onHide}>
            취소
          </Button>
          <Button variant="danger" onClick={this.props.onSubmit}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EventField;
