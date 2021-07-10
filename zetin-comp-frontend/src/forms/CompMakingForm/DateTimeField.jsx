import React from 'react';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

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