import React from 'react';
import MarkdownIt from 'markdown-it';

import Button from 'react-bootstrap/Button';

class MarkdownWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      preview: '',
      previewMode: false,
    };

    this.handlerClick = this.handlerClick.bind(this);
  }

  // render markdown to HTML from value property of children.
  handlerClick() {
    this.setState(
      (prevState) => ({ previewMode: !prevState.previewMode }),
      () => {
        if (this.state.previewMode) {
          const md = new MarkdownIt();
          const { children } = this.props;
          let preview = '';

          if (Array.isArray(children)) {
            children.forEach((child) => {
              if (child.props.value) {
                preview += md.render(child.props.value);
              }
            });
          } else {
            preview = md.render(children.props.value);
          }

          if (preview === '') {
            preview = '<span>미리 볼 내용이 없습니다</span>';
          }

          this.setState({ preview });
        }
      },
    );
  }

  render() {
    const { children } = this.props;
    const { preview, previewMode } = this.state;

    return (
      <div className="markdown-wrapper clearfix">
        <div className={previewMode ? 'd-none' : ''}>{children}</div>
        <div
          className={
            'border border-success rounded px-3 py-2 ' +
            (previewMode ? '' : 'd-none')
          }
          dangerouslySetInnerHTML={{ __html: preview }}
        />
        <div className="float-right mt-2">
          <small className="text-muted mr-3">Markdown 문법을 지원합니다.</small>
          <Button size="sm" variant="secondary" onClick={this.handlerClick}>
            {previewMode ? '수정' : '미리 보기'}
          </Button>
        </div>
      </div>
    );
  }
}

export default MarkdownWrapper;
