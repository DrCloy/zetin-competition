import { useOutletContext } from 'react-router-dom';

import FileUploadForm from '../forms/FileUploadForm';

export default function File() {
  const { token } = useOutletContext();

  return (
    <div>
      <FileUploadForm token={token} />
    </div>
  );
}
