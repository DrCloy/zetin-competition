import React from 'react';
import MarkdownIt from 'markdown-it';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      content: '',
      html: '',
      previewMode: false,
    };

    this.md = new MarkdownIt();

    this.handleChange = this.handleChange.bind(this);
    this.handlePreviewClick = this.handlePreviewClick.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      const value = { title: this.state.title, content: this.state.content };
      this.props.onChange(value);
    });
  }

  handlePreviewClick(e) {
    this.setState(
      (prevState) => ({ previewMode: !prevState.previewMode }),
      () => {
        if (this.state.previewMode) {
          const { content } = this.state;
          let html;
          if (content === '') {
            html = '<p>내용이 없습니다.</p>';
          } else {
            html = this.md.render(this.state.content);
          }
          this.setState({ html });
        }
      },
    );
  }

  render() {
    const { rows, hideTitle } = this.props;
    const { title, content, html, previewMode } = this.state;

    return (
      <Form {...this.props}>
        <Form.Group controlId="mdTitle" className={hideTitle ? 'd-none' : ''}>
          <Form.Control
            type="text"
            name="title"
            value={title}
            onChange={this.handleChange}
            placeholder="제목"
          />
        </Form.Group>
        <div className="clearfix">
          <Form.Group
            controlId="mdContent"
            className={previewMode ? 'd-none' : ''}
          >
            <Form.Control
              as="textarea"
              name="content"
              rows={rows ? rows : 2}
              value={content}
              onChange={this.handleChange}
              placeholder="내용을 작성해주세요"
            />
          </Form.Group>
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            className={'p-2 ' + (previewMode ? '' : 'd-none')}
          />
          <Button
            className="float-right"
            size="sm"
            variant="secondary"
            onClick={this.handlePreviewClick}
          >
            {previewMode ? '수정' : '미리 보기'}
          </Button>
        </div>
      </Form>
    );
  }
}

export default MarkdownEditor;
