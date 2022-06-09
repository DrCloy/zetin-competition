import { formatBytes } from '../utils';
import Table from 'react-bootstrap/Table';

export default function FileTable(props) {
  const { data, renderFunction, ...restProps } = props;

  return (
    <Table striped size="sm" {...restProps}>
      <colgroup>
        <col style={{ width: '30%' }} />
        <col style={{ width: '35%' }} />
        <col style={{ width: '5%' }} />
        <col style={{ width: '15%' }} />
        <col style={{ width: '10%' }} />
        <col style={{ width: '5%' }} />
      </colgroup>
      <thead>
        <tr>
          <th>이름</th>
          <th>설명</th>
          <th>🔒</th>
          <th>형식</th>
          <th>크기</th>
          <th>기능</th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data.map((f) => (
            <tr key={f._id}>
              <td>
                <a
                  href={`/api/files/${f._id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {f.name}
                </a>
              </td>
              <td>{f.description}</td>
              <td>{f.private ? '✓' : ''}</td>
              <td>{f.mimetype}</td>
              <td>{formatBytes(f.size)}</td>
              <td>{renderFunction && renderFunction(f)}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}
