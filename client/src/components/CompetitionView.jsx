import React from 'react';
import axios from 'axios';
import MarkdownIt from 'markdown-it';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

class CompetitionView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMap: false,
      showRuleModal: false,
      ruleLoaded: false,
      ruleTitle: '',
      ruleHTMLContent: '',
    };

    this.md = new MarkdownIt();
  }

  showRuleModal = () => {
    if (!this.state.ruleLoaded) {
      const { rule } = this.props.data;
      axios
        .get(`/api/rules/${rule}`)
        .then((res) => {
          const { name, version, content } = res.data;
          this.setState({
            ruleLoaded: true,
            ruleTitle: `${name} (${version})`,
            ruleHTMLContent: this.md.render(content),
            showRuleModal: true,
          });
        })
        .catch((err) => {
          throw new Error('데이터를 불러오지 못했습니다.');
        });
    } else {
      this.setState({ showRuleModal: true });
    }
  };

  handleCloseModal = () => {
    this.setState({ showRuleModal: false });
  };

  isFieldValid(field) {
    return field !== undefined && field !== '';
  }

  render() {
    const { showMap, showRuleModal, ruleTitle, ruleHTMLContent } = this.state;
    const {
      name,
      desc,
      date,
      place,
      googleMap,
      organizer,
      sponser,
      prize,
      rule,
      moreInfo,
      posterId,
    } = this.props.data;

    return (
      <>
        <Row xs={1} xl={2}>
          <Col md={6}>
            <Image
              className="w-100 pb-4"
              src={`/api/files/${posterId}`}
              rounded
            />
          </Col>
          <Col md={6}>
            {this.isFieldValid(name) ? (
              <h2 className="font-weight-bold">{name}</h2>
            ) : null}
            {this.isFieldValid(desc) ? (
              <div
                dangerouslySetInnerHTML={{ __html: this.md.render(desc) }}
              ></div>
            ) : null}
            {this.isFieldValid(date) ? (
              <>
                <h4 className="font-weight-bold">📅 일시</h4>
                <p>{date}</p>
              </>
            ) : null}
            {this.isFieldValid(place) ? (
              <>
                <h4 className="font-weight-bold">🗺️ 장소</h4>
                <p>
                  {place + ' '}
                  {this.isFieldValid(googleMap) ? (
                    <>
                      {' '}
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => {
                          this.setState((prevState) => ({
                            showMap: !prevState.showMap,
                          }));
                        }}
                      >
                        {showMap ? '지도 가리기' : '지도 보기'}
                      </Button>
                      {showMap ? (
                        <iframe
                          title="place"
                          className="mb-4 rounded"
                          src={googleMap}
                          style={{ width: '100%', height: '450px', border: 0 }}
                          loading="lazy"
                        ></iframe>
                      ) : null}
                    </>
                  ) : null}
                </p>
              </>
            ) : null}
            {this.isFieldValid(organizer) ? (
              <>
                {' '}
                <h4 className="font-weight-bold">🎈 주최 및 주관</h4>
                <p>{organizer}</p>
              </>
            ) : null}
            {this.isFieldValid(sponser) ? (
              <>
                {' '}
                <h4 className="font-weight-bold">💎 후원</h4>
                <p>{sponser}</p>
              </>
            ) : null}
            {this.isFieldValid(prize) ? (
              <>
                {' '}
                <h4 className="font-weight-bold">🏆 시상 내역</h4>
                <div
                  dangerouslySetInnerHTML={{ __html: this.md.render(prize) }}
                ></div>
              </>
            ) : null}
            {this.isFieldValid(rule) ? (
              <>
                {' '}
                <h4 className="font-weight-bold">⚖️ 대회 규정</h4>
                <p>
                  <Button variant="link" onClick={this.showRuleModal}>
                    자세히 보기
                  </Button>
                </p>
              </>
            ) : null}
            {this.isFieldValid(moreInfo) ? (
              <>
                {' '}
                <h4 className="font-weight-bold">📜 추가 정보</h4>
                <div
                  dangerouslySetInnerHTML={{ __html: this.md.render(moreInfo) }}
                ></div>
              </>
            ) : null}
          </Col>
        </Row>
        {/* Modal for Competition Rule */}
        <Modal size="lg" show={showRuleModal} onHide={this.handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{ruleTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div dangerouslySetInnerHTML={{ __html: ruleHTMLContent }}></div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModal}>
              닫기
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default CompetitionView;
