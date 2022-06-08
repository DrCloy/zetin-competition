import { useNavigate } from 'react-router-dom';
import CompetitionForm from '../forms/CompetitionForm';

export default function CreateCompetition() {
  const navigate = useNavigate();

  return (
    <CompetitionForm
      onSubmitted={() => {
        alert(`대회 페이지를 성공적으로 개설하였습니다.`);
        navigate('/admin/management');
      }}
    />
  );
}
