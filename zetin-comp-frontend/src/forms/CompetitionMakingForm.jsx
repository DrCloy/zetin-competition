import React from 'react';

// Bootstrap Components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';

function handleChange(e) {
  const target = e.target;
  
  this.setState({
    [target.id]: target.value
  });
}

class CompetitionMakingForm extends React.Component {
  constructor(props) {
    super(props);

    // instance: 스키마에 대한 실제 데이터, 테이블의 각 행을 의미
    this.state = {
      instance: { },
      compName: '',
      compDesc: '',
    }

    this.handleTextFieldChange = handleChange.bind(this);
  }

  render() {
    return (
      <Form>
        <h2>대회 페이지 개설</h2>
        <Form.Group controlId="compName">
          <Form.Label>이름</Form.Label>
          <Form.Control type="text" />
        </Form.Group>
        <Form.Group controlId="compDesc">
          <Form.Label>설명</Form.Label>
          <Form.Control type="text" />
        </Form.Group>
        <EventField controlId="compEvents"/>
        <DateTimeField prefixOfLabel="대회" controlId="compDate" />
        <DateTimeField prefixOfLabel="참가 신청" controlId="compRegDate" />
        <Button variant="primary" type="submit">개설</Button>
      </Form>
    );
  }
}

class DateTimeField extends React.Component {
  render() {
    return (
      <Row>
        <Form.Group as={Col}>
          <Form.Label>{this.props.prefixOfLabel} 시작 날짜</Form.Label>
          <Form.Control type="datetime-local" />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>{this.props.prefixOfLabel} 종료 날짜</Form.Label>
          <Form.Control type="datetime-local" />
        </Form.Group>
      </Row>
    );
  }
}

class EventField extends React.Component {
  constructor(props) {
    super(props);

    // State
    this.state = {
      classNameOfComp: "",
      classDescOfComp: "",
      listOfEvents: [],
      modalShow: false,
    };

    // Event handlers
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = handleChange.bind(this);
  }

  showModal() {
    this.setState({
      classNameOfComp: "",
      classDescOfComp: "",
      modalShow: true,
    });
  }

  hideModal() {
    this.setState({ modalShow: false });
  }

  handleSubmit(e) {
    const events = this.state.listOfEvents.slice();

    events.push({
      name: this.state.classNameOfComp,
      desc: this.state.classDescOfComp,
    });

    // 중복 체크 해야 함.
    this.setState({
      listOfEvents: events,
      modalShow: false,
    });

    e.preventDefault();
  }

  render() {
    let lgItems;
    let events = this.state.listOfEvents;
    if (events.length) {
      lgItems = events.map((item) =>
        <ListGroup.Item key={item.name}>
          <div>{item.name}</div>
          <div className="text-muted small">{item.desc}</div>
        </ListGroup.Item>
      );
    } else {
      lgItems = <ListGroup.Item>없음</ListGroup.Item>
    }

    return (
      <>
        <Form.Group controlId={this.props.controlId} className="clearfix">
          <Form.Label>경연 부문</Form.Label>
          <ListGroup className="mb-2">
            {lgItems}
          </ListGroup>
          <Button variant="secondary" className="float-right" onClick={this.showModal}>추가</Button>
        </Form.Group>

        <Modal show={this.state.modalShow} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>새 경연 부문</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="classNameOfComp">
                <Form.Label>이름</Form.Label>
                <Form.Control type="text" onChange={this.handleChange}></Form.Control>
              </Form.Group>
              <Form.Group controlId="classDescOfComp">
                <Form.Label>설명</Form.Label>
                <Form.Control as="textarea" rows={2} onChange={this.handleChange}></Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.hideModal}>취소</Button>
            <Button variant="primary" onClick={this.handleSubmit}>추가</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default CompetitionMakingForm;