import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import MarkdownWrapper from '../../components/MarkdownWrapper';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class RuleMakingForm extends React.Component {
  schema = Yup.object().shape({
    name: Yup.string().required('대회 규정 이름을 입력해주세요.'),
    version: Yup.string().required('개정 정보를 입력해주세요.'),
    content: Yup.string().required('대회 규정을 작성해주세요.'),
  });

  render() {
    return (
      <Formik
        initialValues={{ name: '', version: '', content: '' }}
        validationSchema={this.schema}
        onSubmit={(data) => {
          axios
            .post('/api/rules', data)
            .then((res) => alert('성공!'))
            .catch((err) => alert(err));
        }}
      >
        {({ values, touched, errors, handleSubmit, getFieldProps }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="ruleName">
              <Form.Label>이름</Form.Label>
              <Form.Control
                type="text"
                isInvalid={touched.name && errors.name}
                {...getFieldProps('name')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="ruleVersion">
              <Form.Label>버전</Form.Label>
              <Form.Control
                type="text"
                isInvalid={touched.version && errors.version}
                {...getFieldProps('version')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.version}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                대회 규정의 버전이나 규정을 개정한 날짜를 사용합니다.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="ruleContent">
              <Form.Label>규정 내용</Form.Label>
              <MarkdownWrapper>
                <Form.Control
                  as="textarea"
                  rows="16"
                  isInvalid={touched.content && errors.content}
                  {...getFieldProps('content')}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.content}
                </Form.Control.Feedback>
              </MarkdownWrapper>
            </Form.Group>
            <Button type="submit">만들기</Button>
          </Form>
        )}
      </Formik>
    );
  }
}

export default RuleMakingForm;
