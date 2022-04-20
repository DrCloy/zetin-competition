import './Competition.css';

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

import CompetitionView from '../components/CompetitionView';
import EntryForm from '../forms/EntryForm';
import ParticipantTable from '../components/ParticipantTable';
import ParticipantView from '../components/ParticipantView';

function ParticipantContent(props) {
  const { competition } = props;
  const [participant, setParticipant] = useState(null);

  return participant ? (
    <div className="">
      <div className="text-right">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setParticipant(null)}
        >
          목록으로
        </Button>
      </div>
      <ParticipantView participant={participant} />
    </div>
  ) : (
    <ParticipantTable
      competition={competition}
      countPerPage={10}
      onParticipantClick={(data) => setParticipant(data)}
    />
  );
}

function Competition() {
  const [contentIndex, setContentIndex] = useState(0);
  const [competition, setCompetition] = useState(null);
  const { id } = useParams();

  const contents = [
    {
      name: '대회 정보',
      component: <CompetitionView data={competition} hideTitle />,
    },
    {
      name: '참가 신청',
      component: <EntryForm competition={competition} />,
    },
    {
      name: '참가자 목록',
      component: <ParticipantContent competition={competition} />,
    },
  ];

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
      <Container className="my-3" fluid="xl">
        <Row xs={1} sm={2}>
          <Col sm={5}>
            <a
              href={`/api/files/${posterId}`}
              target="_blank"
              rel="noreferrer"
              title="새 창에서 포스터 보기"
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
              {contents.map((value, index) => (
                <Nav.Item>
                  <Nav.Link
                    className={index === contentIndex ? 'active' : ''}
                    onClick={() => setContentIndex(index)}
                  >
                    {value.name}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
            {contents[contentIndex].component}
          </Col>
        </Row>
      </Container>
    );
  }

  return null;
}

export default Competition;
