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
    const { file, width } = this.props;
    const { loading, thumb } = this.state;

    if (file) {
      if (loading) {
        return (
          <Spinner animation="border" role="status" variant="secondary">
            <span className="sr-only">Loading</span>
          </Spinner>
        );
      } else {
        return <Image src={thumb} thumbnail style={{ width }} />;
      }
    }

    return null;
  }
}

export default FileThumbnail;
