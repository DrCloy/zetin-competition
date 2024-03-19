import axios from 'axios';
import { useEffect, useState } from 'react';

import { CompetitionItem } from '../core/model';
import { repo } from '../repository';

export default function Competitions() {
  const [competitions, setCompetitions] = useState<CompetitionItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      setCompetitions(await repo.competitionList.getCompetitions());
    }
    fetchData();
  }, []);

  return <div>{JSON.stringify(competitions)}</div>;
}
