import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/*
 * FieldStack component for react-bootstrap layout
 * 자식 컴포넌트들을 가로로 배치해줍니다.
 * 모바일 화면(screen < 576px)에서는 세로로 배치합니다.
 */
export default function FieldStack(props) {
  const { children } = props;

  if (Array.isArray(children)) {
    const count = children.length;
    return (
      <Row xs={1} md={count}>
        {children.map((child, idx) => (
          <Col key={idx}>{child}</Col>
        ))}
      </Row>
    );
  } else {
    return children;
  }
}
