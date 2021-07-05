import React from 'react';

// Bootstrap Components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';

/*
  Simple onChange handler for simple form control (just for value). 
  You must have to bind this function to the appropriate instance.
*/
function handleChange(e) {
  const targ = e.target;
  
  this.setState({
    [targ.id]: targ.value
  }, () => {
    // console.log('id: ' + targ.id + ', value: ' + targ.value); // for debugging
  });
}

class CompetitionMakingForm extends React.Component {
  constructor(props) {
    super(props);

    // instance: 스키마에 대한 실제 데이터, 테이블의 각 행을 의미
    this.state = {
      instance: {
        compName: '',
        compDesc: '',
        compEvents: {},
      },
    }

    this.handleTextFieldChange = handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEventsUpdate = this.handleEventsUpdate.bind(this);
  }

  handleSubmit(e) {
    console.log(this.state);

    e.preventDefault();
  }

  handleEventsUpdate(events) {
    const eventList = events.slice();

    this.setState((prevState) => ({
      instance: {
        ...prevState.instance,
        compEvents: eventList
      }
    }));
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <h2>대회 페이지 개설</h2>
        <Form.Group controlId="compName">
          <Form.Label>이름</Form.Label>
          <Form.Control type="text" />
        </Form.Group>
        <Form.Group controlId="compDesc">
          <Form.Label>설명</Form.Label>
          <Form.Control as="textarea" rows={4} />
        </Form.Group>
        <EventField controlId="compEvents" onUpdate={this.handleEventsUpdate} />
        <DateTimeField prefixOfLabel="대회" controlId="compDate" />
        <DateTimeField prefixOfLabel="참가 신청" controlId="compRegDate" />
        <Button variant="primary" type="submit" onClick={this.handleSubmit}>개설</Button>
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

    // Modal contents classification
    this.MODE = {
      EDIT: 'method.edit',
      DELETE: 'method.delete',
    }

    // State
    this.state = {
      currIndex: -1,
      currEvent: { name: '', desc: '', numb: 0 },
      events: [],
      modalShow: false,
      modalMode: this.MODE.EDIT,
      modalFormValidation: {
        nameField: { valid: true, message: '' }
      }
    };

    // Event handlers
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);

    // Callback functions
    if (this.props.onUpdate) {
      this.onUpdate = this.props.onUpdate;
    } else {
      this.onUpdate = function (events) { }
    }
  }

  showModal() {
    const currIndex = this.state.currIndex;

    // Initialize fields
    if (currIndex < 0) { // for adding mode
      this.setState({
        currEvent: { name: '', desc: '', numb: 0 }
      });
    } else {
      this.setState({ // for editing mode
        currEvent: { ...this.state.events[currIndex] }
      });
    }
    
    this.setState({
      modalFormValidation: {
        nameField: { valid: true, message: '' }
      }
    });
    this.setState({ modalShow: true }); // Show modal
  }

  handleHideModal(e) {
    this.setState({ modalShow: false });
  }

  handleSubmit(e) {
    const events = this.state.events.slice();
    const index = this.state.currIndex;
    const method = this.state.modalMode;

    switch (method) {
      case this.MODE.EDIT:
        // Check for empty field
        if (this.state.currEvent.name === '') {
          this.setState((prevState) => ({
            modalFormValidation: {
              ...prevState.modalFormValidation,
              nameField: { valid: false, message: '이름을 입력해주세요.' }
            }
          }));
          return;
        }

        // Check for redundancy
        for (let i = 0; i < events.length; i++) {
          if (i === index) continue;
          if (events[i].name === this.state.currEvent.name) {
            this.setState((prevState) => ({
              modalFormValidation: {
                ...prevState.modalFormValidation,
                nameField: { valid: false, message: '중복된 경연 부문이 존재합니다. 다른 이름을 입력해주세요.' }
              }
            }));
            return;
          }
        }

        if (index < 0) { // for adding mode
          events.push({ ...this.state.currEvent });
        } else { // for editing mode
          events[index] = { ...this.state.currEvent };
        }
        break;
      case this.MODE.DELETE: // for deletion mode
        events.splice(index, 1);
        break;
      default:
        break;
    }

    this.setState({ events, modalShow: false }, () => {
      this.onUpdate(this.state.events);
    });

    e.preventDefault();
  }

  render() {
    const lgItems = this.state.events.map((item, index) =>
      <ListGroup.Item key={item.name} className="pb-2">
        <div>{item.name} ({item.numb})</div>
        <div className="text-muted small">{item.desc}</div>
        <div className="float-right">
          <Button variant="outline-secondary" size="sm" className="mr-1 border-0" onClick={() => {
            // set edit mode (index >= 0) and show modal
            this.setState({
              currIndex: index,
              modalMode: this.MODE.EDIT
            }, () => {
              this.showModal();
            });
          }}>수정</Button>
          <Button variant="outline-danger" size="sm" className="border-0" onClick={() => {
            this.setState({
              currIndex: index,
              modalMode: this.MODE.DELETE
            }, () => {
              this.showModal();
            });
          }}>삭제</Button>
        </div>
      </ListGroup.Item>
    );

    const formContents = (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group controlId="eventName">
          <Form.Label>이름</Form.Label>
          <Form.Control
            type="text"
            value={this.state.currEvent.name}
            onChange={(e) => {
              this.setState((prevState) => ({
                currEvent: { ...prevState.currEvent, name: e.target.value }
              }));
            }}
            required isInvalid={!this.state.modalFormValidation.nameField.valid} />
          <Form.Control.Feedback type="invalid">
            {this.state.modalFormValidation.nameField.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="eventDescription">
          <Form.Label>설명</Form.Label>
          <Form.Control
            as="textarea" rows={4}
            value={this.state.currEvent.desc}
            onChange={(e) => {
              this.setState((prevState) => ({
                currEvent: { ...prevState.currEvent, desc: e.target.value }
              }));
            }} />
        </Form.Group>
        <Form.Group controlId="eventNumberOfParticipants">
          <Form.Label>참가 인원</Form.Label>
          <Form.Control
            type="number"
            value={this.state.currEvent.numb}
            onChange={(e) => {
              this.setState((prevState) => ({
                currEvent: { ...prevState.currEvent, numb: parseInt(e.target.value) }
              }));
            }} />
        </Form.Group>
      </Form>
    );

    const deletionContents = (
      <p>정말로 {this.state.currEvent.name} 경연 부문을 삭제하시겠습니까?</p>
    );

    let buttonAttr = {};
    let title;
    let contents;

    switch (this.state.modalMode) {
      case this.MODE.EDIT:
        buttonAttr.caption = this.state.currIndex < 0 ? '추가' : '수정';
        buttonAttr.variant = 'primary';
        title = this.state.currIndex < 0 ? '새 경연 부문' : '경연 부문 수정'
        contents = formContents;
        break;
      case this.MODE.DELETE:
        buttonAttr.caption = '삭제';
        buttonAttr.variant = 'danger';
        title = '경연 부문 삭제';
        contents = deletionContents;
        break;
      default:
        title = '';
        contents = '';
    }

    return (
      <>
        <Form.Group controlId={this.props.controlId} className="clearfix">
          <Form.Label>경연 부문</Form.Label>
          <ListGroup className="mb-2">
            {lgItems.length ? lgItems : <ListGroup.Item>없음</ListGroup.Item>}
          </ListGroup>
          <Button variant="secondary" className="float-right" onClick={() => {
            // set add mode (index < 0) and show modal
            this.setState({
              currIndex: -1,
              modalMode: this.MODE.EDIT
            }, () => {
              this.showModal();
            });
          }}>추가</Button>
        </Form.Group>

        {/*
          < Issue >
          - If animation is true, 'findDOMNode is deprecated in StrictMode' warning is occured.
            (https://github.com/react-bootstrap/react-bootstrap/issues/5075)
          */}
        <Modal show={this.state.modalShow} onHide={this.handleHideModal} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {contents}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleHideModal}>취소</Button>
            <Button variant={buttonAttr.variant} onClick={this.handleSubmit}>
              {buttonAttr.caption}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default CompetitionMakingForm;