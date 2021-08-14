/* Dependencies */
import React, { useState, useEffect } from 'react';
import { Formik, Form as FormikForm, useFormikContext } from 'formik';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import moment from 'moment';

/* Bootstrap Components */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

/* Field & Input Components */
import DateField from './fields/DateField';
import MarkdownField from './fields/MarkdownField';
import SelectField from './fields/SelectField';
import TextField from './fields/TextField';
import EventField from './fields/EventField';
import ImageInput from '../components/ImageInput';

// initial form values Form Values
const initialValues = {
  name: '',
  desc: '',
  events: [],
  regDateStart: '',
  regDateEnd: '',
  date: '',
  place: '',
  googleMap: '',
  organizer: '',
  sponser: '',
  prize: '',
  rule: '',
  moreInfo: '',
  posterId: '',
};

// validation schema with yup
const yupSchema = yup.object({
  name: yup.string().required('대회 이름을 입력해주세요.'),
  events: yup
    .array()
    .default([])
    .min(1, '하나 이상의 경연 대회를 추가해주세요.'),
  regDateStart: yup.string().required('참가 신청 접수 시작일을 입력해주세요.'),
  regDateEnd: yup
    .string()
    .required('참가 신청 접수 종료일을 입력해주세요.')
    .test(
      'minDateTime',
      '참가 신청 접수 시작일보다 빠를 수 없습니다.',
      (value, context) =>
        moment(context.parent.regDateStart).diff(moment(value)) <= 0,
    ),
  date: yup
    .string()
    .required('대회 실시 날짜를 입력해주세요.')
    .test(
      'minDateTime',
      '참가 신청 접수 종료일보다 빠를 수 없습니다.',
      (value, context) =>
        moment(context.parent.regDateEnd).diff(moment(value)) <= 0,
    ),
  googleMap: yup.string().url('URL 형식이 올바르지 않습니다.'),
});

// CompetitionForm component
const CompetitionForm = (props) => {
  const { data } = props;

  const [poster, setPoster] = useState(null);
  const [posterChanged, setPosterChanged] = useState(false);
  const [rules, setRules] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const getPosterBlob = (posterId) => {
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/files/${posterId}`, { responseType: 'blob' })
          .then((res) => resolve(res.data))
          .catch((err) => reject(err));
      });
    };

    // get rules & poster image
    (async () => {
      let ruleResponse = [];
      let posterBlob = null;

      try {
        ruleResponse = await axios.get(`/api/rules`);
        if (data && !!data.posterId) {
          posterBlob = await getPosterBlob(data.posterId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setPoster(posterBlob);
        setRules(ruleResponse.data);
      }
    })();
  }, [data]);

  const handleSubmit = async (competition, formikBag) => {
    let posterDoc = null;
    let competitionDoc = null;

    try {
      // upload poster image file
      if (posterChanged) {
        if (poster) {
          const fileForm = new FormData();

          fileForm.set('file', poster);
          if (!competition.posterId) {
            // create new poster document
            fileForm.set('category', 'poster');
            fileForm.set('description', competition.name);
            posterDoc = await axios.post(`/api/files`, fileForm);
            // set posterId to competition document
            competition.posterId = posterDoc.data._id;
          } else {
            // modify poster document (change image file)
            posterDoc = await axios.patch(
              `/api/files/${competition.posterId}`,
              fileForm,
            );
          }
        } else {
          if (competition.posterId) {
            // delete poster document
            posterDoc = await axios.delete(
              `/api/files/${competition.posterId}`,
            );
            competition.posterId = '';
          }
        }
      }

      // post competition values
      if (!data) {
        // create new competition document
        competitionDoc = await axios.post(`/api/competitions`, competition);
      } else {
        // modify competition document
        competitionDoc = await axios.patch(
          `/api/competitions/${data._id}`,
          competition,
        );
      }

      history.push(`/competitions/${competitionDoc.data._id}`);
      formikBag.setStatus(undefined);
    } catch (err) {
      console.error(err);
      formikBag.setStatus(new Error('제출 중 오류가 발생했습니다.'));
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yupSchema}
      onSubmit={handleSubmit}
    >
      <FormikForm noValidate>
        <FormikEffect data={data} />
        <TextField label="이름" name="name" controlId="compName" />
        <MarkdownField label="설명" name="desc" controlId="compDesc" />
        <EventField label="경연 부문" name="events" controlId="compEvents" />
        <Row>
          <Col md>
            <DateField
              label="참가 신청 접수 시작일"
              name="regDateStart"
              controlId="compRegDateStart"
            />
          </Col>
          <Col md>
            <DateField
              label="참가 신청 접수 종료일"
              name="regDateEnd"
              controlId="compRegDateEnd"
            />
          </Col>
          <Col md>
            <DateField
              label="대회 개최일"
              name="date"
              controlId="compDate"
              enableTime
            />
          </Col>
        </Row>
        <Row>
          <Col md>
            <TextField label="장소" name="place" controlId="compPlace" />
          </Col>
          <Col md>
            <TextField
              label="구글 지도"
              name="googleMap"
              controlId="compGoogleMap"
              advice={
                <>
                  <a
                    href="https://www.google.com/maps/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    구글 지도
                  </a>
                  의 "공유 &gt; 지도 퍼가기"에서 iframe의 src 속성을
                  입력해주세요.
                </>
              }
            />
          </Col>
        </Row>
        <Row>
          <Col md>
            <TextField
              label="주최 및 주관"
              name="organizer"
              controlId="compOrganizer"
            />
          </Col>
          <Col md>
            <TextField label="후원" name="sponser" controlId="compSponser" />
          </Col>
        </Row>
        <MarkdownField
          label="시상 내역"
          name="prize"
          controlId="compPrize"
          rows="4"
        />
        <SelectField
          label="대회 규정"
          name="rule"
          options={
            rules &&
            rules.map((value) => [
              value._id,
              `${value.name} (${value.version})`,
            ])
          }
          controlId="compRule"
        />
        <MarkdownField
          label="추가 정보"
          name="moreInfo"
          controlId="compMoreInfo"
        />
        <ImageInput
          label="대회 포스터"
          value={poster}
          onChange={(e) => {
            setPoster(e);
            setPosterChanged(true);
          }}
          controlId="compPoster"
        />
        <hr />
        <SubmitButton />
      </FormikForm>
    </Formik>
  );
};

// side effect processing component
const FormikEffect = (props) => {
  const { data } = props;
  const { resetForm } = useFormikContext();

  // side effect for changing competition data
  useEffect(() => {
    resetForm({ values: { ...initialValues, ...data } });
  }, [data, resetForm]);

  return null;
};

// submit button component
const SubmitButton = (props) => {
  const { submitForm, isSubmitting, isValid, submitCount, status } =
    useFormikContext();

  let error = '';
  if (!isValid && !!submitCount) {
    error = '대회 페이지 입력이 유효하지 않습니다.';
  } else if (status instanceof Error) {
    error = status.message;
  }

  return (
    <>
      <Button
        className="mr-3"
        disabled={isSubmitting}
        onClick={!isSubmitting ? submitForm : null}
      >
        {isSubmitting ? '제출 중...' : '제출'}
      </Button>
      {error ? (
        <p className="text-danger d-inline align-middle">{error}</p>
      ) : null}
    </>
  );
};

export default CompetitionForm;
