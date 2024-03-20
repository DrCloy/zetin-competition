import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CompetitionCard({
  id,
  name,
  posterId,
}: {
  id: string;
  name: string;
  posterId: string;
}) {
  const [source, setSource] = useState<string | undefined>(
    `api/files/${posterId}?thumbnail=true`,
  );
  const [error, setError] = useState<Error | undefined>(undefined);

  const handelError = () => {
    if (!error) {
      setSource(
        'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
      );
      setError(new Error('Image not found.'));
    }
  };
  return (
    <Link
      to={`/competitions/${id}`}
      className="border rounded border-shadow transition-all duration-200 no-underline hover:scale-102 hover:shadow-competition-card "
    >
      <img
        src={source}
        alt={name}
        onError={handelError}
        className="aspect-3/4 w-full max-w-full"
      />
      <div className="p-5 text-xl">
        <div>{name}</div>
      </div>
    </Link>
  );
}
