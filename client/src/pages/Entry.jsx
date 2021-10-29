import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import PageNotFound from '../components/PageNotFound';
import PageWrapper from './PageWrapper';
import EntryForm from '../forms/EntryForm';

const Entry = (props) => {
  const [competition, setCompetition] = useState(null);
  const { competitionId } = useParams();

  useEffect(() => {
    if (competitionId) {
      (async () => {
        const resCompetition = await axios.get(
          `/api/competitions/${competitionId}`,
        );

        setCompetition(resCompetition.data);
      })();
    }
  }, [competitionId]);

  if (!competitionId) {
    return <PageNotFound />;
  }

  return (
    <PageWrapper
      title="대회 참가하기"
      subTitle={competition && competition.name}
      page={<EntryForm competition={competition} />}
    ></PageWrapper>
  );
};

export default Entry;
