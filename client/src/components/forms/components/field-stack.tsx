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
    const count = children.length;
    return (
      <div className={`grid grid-cols-1 md:grid-cols-${count} gap-4`}>
        {children.map((child, index) => (
          <div key={index} className={`max-w-[${100 / count}%] w-full`}>
            {child}
          </div>
        ))}
      </div>
    );
  } else {
    return <div>{children}</div>;
  }
}
