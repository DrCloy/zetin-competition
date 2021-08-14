import React from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';

// Custom UIs
import TextField from '../fields/TextField';
import MarkdownField from '../fields/MarkdownField';
import SelectField from '../fields/SelectField';
import DateField from '../fields/DateField';
import ImageInput from '../../components/ImageInput';
import EventField from '../fields/EventField';

// Bootstrap Components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class CompetitionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rules: [],
      poster: null,
    };

    // schema of competition
    this.schema = yup.object().shape({
      name: yup.string().default('').required('대회 이름을 입력해주세요.'),
      desc: yup.string().default(''),
      events: yup
        .array()
        .default([])
        .min(1, '하나 이상의 경연 대회를 추가해주세요.'),
      regDateStart: yup
        .string()
        .default('')
        .required('참가 신청 접수 시작일을 입력해주세요.'),
      regDateEnd: yup
        .string()
        .default('')
        .required('참가 신청 접수 종료일을 입력해주세요.')
        .test(
          'is-later-than-regStartDate',
          '참가 신청 접수 시작일보다 빠를 수 없습니다.',
          function (value) {
            // https://github.com/jquense/yup/issues/420#issuecomment-540080334
            const regDateStart = new Date(this.options.parent.regDateStart);
            const regDateEnd = new Date(value);
            return regDateStart.getTime() <= regDateEnd.getTime();
          },
        ),
      date: yup
        .string()
        .default('')
        .required('대회 실시 날짜를 입력해주세요.')
        .test(
          'is-later-than-regStartEnd',
          '참가 신청 접수 종료일보다 빠를 수 없습니다.',
          function (value) {
            const regDateEnd = new Date(this.options.parent.regDateEnd);
            const date = new Date(value);
            return regDateEnd.getTime() <= date.getTime();
          },
        ),
      place: yup.string().default(''),
      googleMap: yup.string().default('').url('URL 형식이 올바르지 않습니다.'),
      organizer: yup.string().default(''),
      sponser: yup.string().default(''),
      prize: yup.string().default(''),
      rule: yup.string().default(''),
      moreInfo: yup.string().default(''),
      posterId: yup.string().default(''),
    });

    this.posterFileInput = React.createRef();
  }

  getInitialValues() {
    const { competition } = this.props;

    // initial values (set default value of schema and overwrite data from props)
    let initialValues = { ...this.schema.getDefaultFromShape() };
    if (typeof competition === 'object') {
      initialValues = { ...initialValues, ...competition };
    }

    return initialValues;
  }

  getPosterBlob(posterId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/files/${posterId}`, { responseType: 'blob' })
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  async componentDidMount() {
    try {
      const { competition } = this.props;

      let ruleResponse = await axios.get(`/api/rules`);
      let posterFile = null;
      if (typeof competition === 'object' && competition.posterId) {
        posterFile = await this.getPosterBlob(competition.posterId);
      }

      this.setState({ rules: ruleResponse.data.slice(), poster: posterFile });
    } catch (err) {
      console.error(err);
    }
  }

  async componentDidUpdate(prevProps) {
    try {
      const { competition } = this.props;

      if (competition !== prevProps.competition) {
        let posterFile = null;
        if (typeof competition === 'object' && competition.posterId) {
          posterFile = await this.getPosterBlob(competition.posterId);
        }
        this.setState({ poster: posterFile });
      }
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { competition, onSubmitFinished } = this.props;
    const isNew = !competition;
    const posterId = competition ? competition.posterId : undefined;

    return (
      <>
        <Formik
          initialValues={this.getInitialValues()}
          validationSchema={this.schema}
          onSubmit={async (data) => {
            try {
              // upload poster image file
              if (this.state.poster) {
                const fileForm = new FormData();
                let file;

                fileForm.set('file', this.state.poster);
                if (!data.posterId) {
                  fileForm.set('category', 'poster');
                  fileForm.set('description', `${data.name}`);
                  file = await axios.post(`/api/files`, fileForm);
                } else {
                  file = await axios.patch(`/api/files/${posterId}`, fileForm);
                }

                data.posterId = file.data._id;
              } else {
                if (!isNew) {
                  await axios.delete(`/api/files/${posterId}`);
                }
                data.posterId = '';
              }

              // post data
              let comp;
              if (isNew) {
                comp = await axios.post(`/api/competitions`, data);
              } else {
                comp = await axios.patch(
                  `/api/competitions/${competition._id}`,
                  data,
                );
              }

              if (typeof onSubmitFinished === 'function') {
                onSubmitFinished(comp);
              }
            } catch (err) {
              console.error(err);
            }
          }}
        >
          {({
            values,
            touched,
            errors,
            isValid,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            getFieldProps,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <TextField label="이름" name="name" controlId="compName" />
              <MarkdownField label="설명" name="desc" controlId="compDesc" />
              <EventField
                label="경연 부문"
                name="events"
                controlId="compEvents"
              />
              <Row>
                <Col lg>
                  <DateField
                    label="참가 신청 접수 시작일"
                    name="regDateStart"
                    controlId="compRegDateStart"
                  />
                </Col>
                <Col lg>
                  <DateField
                    label="참가 신청 접수 종료일"
                    name="regDateEnd"
                    controlId="compRegDateEnd"
                    disabled={!values.regDateStart}
                  />
                </Col>
                <Col lg>
                  <DateField
                    label="대회 개최일"
                    name="date"
                    controlId="compDate"
                    disabled={!values.regDateEnd}
                    enableTime
                  />
                </Col>
              </Row>
              <TextField label="장소" name="place" controlId="compPlace" />
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
              <TextField
                label="주최 및 주관"
                name="organizer"
                controlId="compOrganizer"
              />
              <TextField label="후원" name="sponser" controlId="compSponser" />
              <MarkdownField
                label="시상 내역"
                name="prize"
                controlId="compPrize"
                rows="4"
              />
              <SelectField
                label="대회 규정"
                name="rule"
                options={this.state.rules.map((value) => [
                  value._id,
                  `${value.name} (${value.version})`,
                ])}
                controlId="compRule"
              />
              <MarkdownField
                label="추가 정보"
                name="moreInfo"
                controlId="compMoreInfo"
              />
              <ImageInput
                label="대회 포스터"
                value={this.state.poster}
                onChange={(e) => this.setState({ poster: e })}
                controlId="compPoster"
              />
              <hr />
              <Button className="mr-2" type="submit">
                {isNew ? '개설' : '수정'}
              </Button>
              <Button
                variant="info"
                onClick={() => {
                  alert(JSON.stringify(values));
                  console.log(values);
                }}
              >
                값 미리보기
              </Button>
              {isValid ? null : (
                <div>폼이 invalid합니다. 필드를 확인해주세요.</div>
              )}
            </Form>
          )}
        </Formik>
      </>
    );
  }
}

export default CompetitionForm;
