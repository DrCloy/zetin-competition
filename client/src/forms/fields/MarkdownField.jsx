import React from 'react';
import Form from 'react-bootstrap/Form';
import { useField } from 'formik';

import MarkdownWrapper from '../../components/MarkdownWrapper';

const MarkdownField = (props) => {
  const { label, name, controlId, rows } = props;

  const [field] = useField(name);

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <MarkdownWrapper>
        <Form.Control as="textarea" rows={rows || 8} {...field} />
      </MarkdownWrapper>
    </Form.Group>
  );
};

export default MarkdownField;
