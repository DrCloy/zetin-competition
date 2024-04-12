import { useEffect, useState } from 'react';

import { CompetitionItemMeta } from '../core/model';
import { repo } from '../di';
import CompetitionCard from 'components/competition-card';

export default function Competitions() {
  const [competitions, setCompetitions] = useState<CompetitionItemMeta[]>([]);

  useEffect(() => {
    async function fetchData() {
      setCompetitions(await repo.competitionList.getCompetitionList());
    }
    fetchData();
  }, []);

  return (
    <div className="flex self-center m-auto px-5 py-4 max-w-screen-xl ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mx-0 my-auto gap-5 ">
        {competitions.map((competition) => (
          <CompetitionCard key={competition.id} {...competition} />
        ))}
      </div>
    </div>
  );
}
