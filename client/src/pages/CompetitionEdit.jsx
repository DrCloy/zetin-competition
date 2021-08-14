import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import PageWrapper from './PageWrapper';
import CompetitionForm from '../forms/CompetitionForm';
import PageNotFound from '../components/PageNotFound';

function CompetitionEdit() {
  const { id } = useParams();

  const [competition, setCompetition] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (id) {
      // modification mode
      axios
        // get the competition document correspond to the id
        .get(`/api/competitions/${id}`)
        .then((res) => {
          setCompetition(res.data);
          setIsError(false);
        })
        .catch((err) => {
          setCompetition(null);
          setIsError(err);
        });
    }
  }, [id]);

  if (isError) return <PageNotFound />;
  if (!id)
    return <PageWrapper title="대회 페이지 개설" page={<CompetitionForm />} />;
  if (competition)
    return (
      <PageWrapper
        title="대회 페이지 수정"
        page={<CompetitionForm data={competition} />}
      />
    );

  return null;
}

export default CompetitionEdit;
