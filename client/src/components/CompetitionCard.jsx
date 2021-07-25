import React from 'react';
import { Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';

import './CompetitionCard.css';

class CompetitionCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      src: `/files/posters/thumbnail/${props.data._id}`,
      errored: false,
    };

    this.handleError = this.handleError.bind(this);
  }

  handleError() {
    if (!this.state.errored) {
      this.setState({
        src: 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
        errored: true,
      });
    }
  }

  render() {
    const { _id, name } = this.props.data;
    const { src } = this.state;

    return (
      <Card className="card-competition" as={Link} to={`/competitions/${_id}`}>
        <Card.Img variant="top" src={src} onError={this.handleError} />
        <Card.Body className="text-dark">
          <Card.Title>{name}</Card.Title>
        </Card.Body>
      </Card>
    );
  }
}

export default CompetitionCard;
