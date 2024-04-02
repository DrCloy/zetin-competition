/**
 * FieldStack component
 * 자식 컴포넌트들을 가로로 배치하는 컴포넌트
 * 모바일 화면에서는 세로로 배치
 */

export default function FieldStack({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  if (Array.isArray(children)) {
    return (
      <div className="grid grid-flow-row md:grid-flow-col gap-4">
        {children.map((child, index) => (
          <div key={index}>{child}</div>
        ))}
      </div>
    );
  } else {
    return <div>{children}</div>;
  }
}
