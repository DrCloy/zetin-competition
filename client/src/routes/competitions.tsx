import axios from 'axios';
import { useEffect, useState } from 'react';

type Competition = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export default function Competitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get<Competition[]>('/api/competitions');
      setCompetitions(data);
    }
    fetchData();
  }, []);

  return <div>{JSON.stringify(competitions)}</div>;
}
