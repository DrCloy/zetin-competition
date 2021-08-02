import React from 'react';

import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';

// https://codesandbox.io/s/lkkjpr5r7
class FileThumbnail extends React.Component {
  state = {
    loading: false,
    thumb: undefined,
  };

  componentDidUpdate(prevProps) {
    if (!this.props.file) return;

    if (this.props.file !== prevProps.file) {
      this.setState({ loading: true }, () => {
        let reader = new FileReader();

        reader.onloadend = () => {
          this.setState({ loading: false, thumb: reader.result });
        };
        reader.readAsDataURL(this.props.file);
      });
    }
  }

  render() {
    const { file, defaultSrc, width } = this.props;
    const { loading, thumb } = this.state;

    const Thumbnail = (src) => (
      <div className="d-block">
        <Image src={src} thumbnail style={{ width }} />
      </div>
    );
    const Default = (
      <div
        className="d-block border border-grey rounded"
        style={{ width: 100, height: 100 }}
      ></div>
    );

    if (file) {
      if (loading) {
        return (
          <Spinner animation="border" role="status" variant="secondary">
            <span className="sr-only">Loading</span>
          </Spinner>
        );
      } else {
        return Thumbnail(thumb);
      }
    } else {
      if (defaultSrc) {
        return Thumbnail(defaultSrc);
      }
    }

    return Default;
  }
}

export default FileThumbnail;
