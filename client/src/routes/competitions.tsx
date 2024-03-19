import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Competitions() {
  const [competitions, setCompetitions] = useState();

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get('/api/competitions');
      setCompetitions(data);
    }
    fetchData();
  }, []);

  return <div>{JSON.stringify(competitions)}</div>;
}
