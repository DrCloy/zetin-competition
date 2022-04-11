import './Competition.css';

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

import CompetitionView from '../components/CompetitionView';
import EntryForm from '../forms/EntryForm';
import ParticipantTable from '../components/ParticipantTable';

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
    const { name, posterId } = competition;

    return (
      <Tab.Container defaultActiveKey="view">
        <Container className="my-3" fluid="xl">
          <Row xs={1} sm={2}>
            <Col sm={5}>
              <a
                href={`/api/files/${posterId}`}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  className="w-100 mb-2"
                  src={`/api/files/${posterId}?thumbnail=true`}
                  rounded
                />
              </a>
            </Col>
            <Col sm={7}>
              <h2
                className="font-weight-bold mb-3"
                style={{ wordBreak: 'keep-all' }}
              >
                {name}
              </h2>
              <Nav
                variant="pills"
                className="competition-nav mb-3 rounded bg-light p-2"
              >
                <Nav.Item>
                  <Nav.Link eventKey="view">대회 정보</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="entry">참가 신청</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="list">참가자 목록</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="result">경연 결과</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="view">
                  <CompetitionView data={competition} hideTitle />
                </Tab.Pane>
                <Tab.Pane eventKey="entry">
                  <EntryForm competition={competition} />
                </Tab.Pane>
                <Tab.Pane eventKey="list">
                  <ParticipantTable competition={competition} />
                </Tab.Pane>
                <Tab.Pane eventKey="result">경연 결과</Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Container>
      </Tab.Container>
    );
  }

  return null;
}

export default Competition;
