import { useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

import { checkDateTerm } from '../utils';
import EntryForm from '../forms/EntryForm';

export default function Entry() {
  const { competition } = useOutletContext();
  const { regDateStart, regDateEnd, _id } = competition;
  const navigate = useNavigate();
  const isRegistrationPeriod = checkDateTerm(
    Date.now(),
    regDateStart,
    regDateEnd,
  );

  useEffect(() => {
    if (!isRegistrationPeriod) {
      alert('참가 신청 기간이 아닙니다.');
      navigate(`/competitions/${_id}`);
    }
  }, [isRegistrationPeriod, navigate, _id]);

  return (
    isRegistrationPeriod && (
      <EntryForm
        competition={competition}
        onSubmitted={(res) => {
          const { competitionId } = res.data;
          navigate(`/competitions/${competitionId}/participants`);
        }}
      />
    )
  );
}
