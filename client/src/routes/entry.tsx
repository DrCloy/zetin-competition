import ParticipantForm from 'components/forms/participant-form';
import { CompetitionItem, ParticipantInput } from 'core/model';
import { repo } from 'di';
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

  const onSubmit = async (data: ParticipantInput) => {
    await repo.participantManager.createParticipant(data);
    alert('참가 신청이 완료되었습니다.');
    navigate(-1);
  };

  return isRegisterPeriod ? (
    <ParticipantForm
      competition={competition}
      participant={null}
      onSubmitted={(data: ParticipantInput) => {
        onSubmit(data);
      }}
    />
  ) : null;
}
