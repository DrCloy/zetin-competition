import { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import axios from 'axios';

import ParticipantTable from '../components/ParticipantTable';
import ParticipantView from '../components/ParticipantView';

export default function Participants() {
  const { competition } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [participant, setParticipant] = useState(null);

  const participantId = searchParams.get('pid');

  useEffect(() => {
    if (participantId) {
      axios
        .get(`/api/participants/${participantId}`)
        .then((res) => setParticipant(res.data))
        .catch((err) => setParticipant(null));
    } else {
      setParticipant(null);
    }
  }, [participantId]);

  return participant ? (
    <ParticipantView participant={participant} />
  ) : (
    <ParticipantTable
      competition={competition}
      onParticipantClick={(pid) => {
        setSearchParams({ pid });
      }}
      countPerPage={10}
      searchParamName={'pid'}
    />
  );
}
