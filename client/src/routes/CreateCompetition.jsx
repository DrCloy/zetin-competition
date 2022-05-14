import { useOutletContext } from 'react-router-dom';
import CompetitionForm from '../forms/CompetitionForm';

export default function CreateCompetition() {
  const { token } = useOutletContext();

  return (
    <CompetitionForm
      token={token}
      onSubmitSuccess={(id) => {
        alert(`대회 페이지를 성공적으로 개설하였습니다.`);
      }}
    />
  );
}
