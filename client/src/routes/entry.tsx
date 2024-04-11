import ParticipantForm from 'components/forms/participant-form';
import { CompetitionItem } from 'core/model';
import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { checkDateTerm } from 'utils';

export default function Entry() {
  const { competition }: { competition: CompetitionItem } = useOutletContext();
  const navigate = useNavigate();
  const isRegisterPeriod = checkDateTerm(
    new Date(),
    competition.regDateStart,
    competition.regDateEnd,
  );

  useEffect(() => {
    if (!isRegisterPeriod) {
      alert('참가 신청 기간이 아닙니다.');
      navigate(-1);
    }
  }, [isRegisterPeriod, navigate]);

  return isRegisterPeriod ? (
    <ParticipantForm
      competition={competition}
      participant={null}
      onSubmit={() => {
        alert('참가 신청이 완료되었습니다.');
        navigate(-1);
      }}
    />
  ) : null;
}
