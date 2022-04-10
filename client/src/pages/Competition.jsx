import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

import CompetitionView from '../components/CompetitionView';

function Competition() {
  const [competition, setCompetition] = useState(null);
  const { id } = useParams();

  // get the competition document correspond to the id
  useEffect(() => {
    axios
      .get(`/api/competitions/${id}`)
      .then((res) => {
        setCompetition(res.data);
      })
      .catch((err) => {
        setCompetition(null);
      });
  }, [id]);

  if (competition) {
    const { posterId } = competition;

    return (
      <Container>
        <Row xs={1} sm={2}>
          <Col sm={5}>
            <a href={`/api/files/${posterId}`} target="_blank" rel="noreferrer">
              <Image
                className="w-100 mb-2"
                src={`/api/files/${posterId}?thumbnail=true`}
                rounded
              />
            </a>
          </Col>
          <Col sm={7}>
            <CompetitionView data={competition} />
          </Col>
        </Row>
      </Container>
    );
  }

  return null;
}

export default Competition;
