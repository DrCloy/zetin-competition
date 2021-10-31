import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import PageWrapper from './PageWrapper';
import ParticipantTable from '../components/ParticipantTable';

const Participant = (props) => {
  const { competitionId } = useParams();
  const [competition, setCompetition] = useState(null);

  useEffect(() => {
    async function getCompetition() {
      const res = await axios.get(`/api/competitions/${competitionId}`);
      setCompetition(res.data);
    }

    if (competitionId) {
      getCompetition();
    }
  }, [competitionId]);

  const handleParticipantClick = async (value) => {
    alert(
      `${value.name} 참가자를 클릭하셨습니다! (로봇 이름: ${value.robotName})`,
    );
  };

  return (
    <PageWrapper
      title={competition && competition.name}
      subTitle="참가자 명단"
      page={
        <ParticipantTable
          competition={competition}
          onParticipantClick={handleParticipantClick}
        />
      }
    />
  );
};

export default Participant;
