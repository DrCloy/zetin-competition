import Container from 'react-bootstrap/Container';

// privacy
import privacy_old from '../forms/agreements/privacy_old';
import privacy_20220714 from '../forms/agreements/privacy_20220714';

export default function Privacy() {
  return (
    <Container className="my-3" fluid="xl">
      <h1 className="mb-4">ZETIN 라인트레이서 경연대회 개인정보 처리 방침</h1>
      <h2 className="text-center">2022년 07월 14일 이전</h2>
      {privacy_old.detail}
      <hr />
      <h2 className="text-center">2022년 07월 14일 이후</h2>
      {privacy_20220714.detail}
    </Container>
  );
}
