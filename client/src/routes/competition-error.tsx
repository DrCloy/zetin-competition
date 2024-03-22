import { Link } from 'react-router-dom';

export default function CompetitionError() {
  return (
    <div>
      <h1>Competition not found</h1>
      <p>Sorry, the competition you are looking for does not exist.</p>
      <Link className="font-bold text-uos-signature-blue" to="/competitions">
        Back to competitions
      </Link>
    </div>
  );
}
