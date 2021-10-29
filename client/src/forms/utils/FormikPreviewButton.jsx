import React from 'react';
import { useFormikContext } from 'formik';
import Button from 'react-bootstrap/Button';

const FormikPreviewButton = () => {
  const { values } = useFormikContext();

  const handleClick = () => {
    const beautified = JSON.stringify(values, null, 2);
    console.log(values);
    alert(beautified);
  };

  return (
    <Button variant="secondary" onClick={handleClick}>
      값 미리보기
    </Button>
  );
};

export default FormikPreviewButton;
