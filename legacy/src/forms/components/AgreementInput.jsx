import { useFormContext } from 'react-hook-form';
import Form from 'react-bootstrap/Form';

export default function AgreementInput(props) {
  const { id, name, agreement, ...restProps } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { detail, content } = agreement;

  const error = errors[name]?.message;

  return (
    <Form.Group controlId={id}>
      {detail}
      <Form.Check
        {...restProps}
        {...register(name)}
        type="checkbox"
        isInvalid={!!error}
        feedback={error}
        label={content}
      />
    </Form.Group>
  );
}
