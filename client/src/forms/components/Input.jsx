import { useFormContext } from 'react-hook-form';
import Form from 'react-bootstrap/Form';

/*
 * Input component using react-hook-form and react-bootstrap
 * Required Props: id: string, name: string
 */
export default function Input(props) {
  const { id, label, name, advice, children, ...restProps } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message;

  return (
    <Form.Group controlId={id}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control {...restProps} {...register(name)} isInvalid={error}>
        {children}
      </Form.Control>
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      {advice && <Form.Text className="text-muted">{advice}</Form.Text>}
    </Form.Group>
  );
}
