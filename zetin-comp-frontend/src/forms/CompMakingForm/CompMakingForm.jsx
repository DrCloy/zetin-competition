import React from 'react';

// Custom modules
import Validation from '../Validation';

// Custom UIs
import EventField from './EventField';

// Bootstrap Components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class CompMakingForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      desc: '',
      events: [],
      validations: this.makeValidations(),
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEventChange = this.handleEventChange.bind(this);
  }

  makeValidations() {
    return {
      name: new Validation(),
      events: new Validation(),
    };
  }

  validate() {
    const validations = this.makeValidations();

    // validate name state
    if (this.state.name === '') {
      validations.name.setInvalid('대회 이름을 입력해주세요.');
    }

    // validate events state
    if (this.state.events.length === 0) {
      validations.events.setInvalid('하나 이상의 경연 대회를 추가해주세요.');
    }

    // update state
    this.setState({ validations });

    // return true when form is valid
    let ret = true;
    for (const val in validations) {
      if (validations[val].isInvalid) {
        ret = false;
        break;
      }
    }
    return ret;
  }

  handleSubmit(e) {
    if (this.validate()) {
      console.log(this.state);
    }

    e.preventDefault();
  }

  handleEventChange(e) {
    const idx = e.index;
    const evt = e.event;
    const events = this.state.events.slice();

    if (idx === -1) {
      // add event
      events.push({ ...evt });
    } else {
      if (evt === null) {
        // delete event
        events.splice(idx, 1);
      } else {
        // modify event
        events.splice(idx, 1, { ...evt });
      }
    }

    this.setState({ events });
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <h2>대회 페이지 개설</h2>
        <Form.Group controlId="compName">
          <Form.Label>이름</Form.Label>
          <Form.Control
            type="text"
            onChange={(e) => {
              this.setState({ name: e.target.value });
            }}
            isInvalid={this.state.validations.name.isInvalid}
          />
          <Form.Control.Feedback type="invalid">
            {this.state.validations.name.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="compDesc">
          <Form.Label>설명</Form.Label>
          <Form.Control
            as="textarea"
            rows="4"
            onChange={(e) => {
              this.setState({ desc: e.target.value });
            }}
          />
        </Form.Group>
        <EventField
          events={this.state.events}
          onChange={this.handleEventChange}
          isInvalid={this.state.validations.events.isInvalid}
          msgForInvalid={this.state.validations.events.message}
        />
        <Button variant="primary" type="submit" onClick={this.handleSubmit}>
          개설
        </Button>
      </Form>
    );
  }
}

export default CompMakingForm;
