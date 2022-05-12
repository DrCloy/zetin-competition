import { useOutletContext, useNavigate } from 'react-router-dom';

import EntryForm from '../forms/EntryForm';

export default function Entry() {
  const { competition } = useOutletContext();
  const navigate = useNavigate();

  return (
    <EntryForm
      competition={competition}
      onSubmitted={(res) => {
        const { competitionId } = res.data;
        navigate(`/competitions/${competitionId}/participants`);
      }}
    />
  );
}
