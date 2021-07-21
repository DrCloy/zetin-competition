import React from 'react';

import Card from 'react-bootstrap/Card';

class CompetitionCard extends React.Component {
  render() {
    const { name, desc, poster } = this.props;

    return (
      <Card>
        <Card.Img variant="top" src={poster} />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>{desc}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default CompetitionCard;
