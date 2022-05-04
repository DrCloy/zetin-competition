import './OrderSelector.css';

export default function OrderSelector(props) {
  const { count, selectedOrders, onChange, value } = props;

  const cells = [];
  for (let i = 0; i < count; i++) {
    let className = 'cell';
    if (selectedOrders[i]) className += ' active';
    if (value === i) className += ' selected';

    cells.push(
      <div
        className={className}
        key={i}
        onClick={onChange && (() => onChange(i))}
      >
        {i + 1}
      </div>,
    );
  }

  return <div className="cell-container">{cells}</div>;
}
