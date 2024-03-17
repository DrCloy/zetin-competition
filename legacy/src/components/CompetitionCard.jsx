import './CompetitionCard.css';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';

function CompetitionCard(props) {
  const {
    data: { _id, name, posterId },
  } = props;

  const [source, setSource] = useState(`/api/files/${posterId}?thumbnail=true`);
  const [error, setError] = useState(null);

  const handleError = () => {
    if (!error) {
      setSource(
        'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
      );
      setError(new Error('Image not found.'));
    }
  };

  return (
    <Card className="card-competition" as={Link} to={`/competitions/${_id}`}>
      <Card.Img variant="top" src={source} onError={handleError} />
      <Card.Body className="text-dark">
        <Card.Title>{name}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default CompetitionCard;
