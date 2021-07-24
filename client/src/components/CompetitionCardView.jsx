import React from 'react';

import CompetitionCard from './CompetitionCard';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class CompetitionCardView extends React.Component {
  render() {
    return (
      <>
        <Row xs={1} sm={2} lg={4}>
          {this.props.data.map((value) => (
            <Col className="p-2" key={value._id}>
              <CompetitionCard data={value} />
            </Col>
          ))}
        </Row>
      </>
    );
  }
}

export default CompetitionCardView;
