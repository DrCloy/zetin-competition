import { useState, useEffect } from 'react';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import CompetitionCard from '../components/CompetitionCard';

export default function Competitions() {
  const [competitions, setCompetitions] = useState([]);

  useEffect(() => {
    axios.get('/api/competitions').then((res) => {
      setCompetitions(res.data);
    });
  }, []);

  return (
    <Container className="px-4 py-2" fluid="xl">
      <Row xs={1} sm={3} lg={4}>
        {competitions.map((comp) => (
          <Col className="p-2" key={comp._id}>
            <CompetitionCard data={comp} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
