import React, { useState, useEffect } from 'react';

import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';

const ImageThumbnail = (props) => {
  const { file, defaultSrc, width } = props;

  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (file) setLoading(true);
    else setLoading(false);
  }, [file]);

  useEffect(() => {
    if (loading) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLoading(false);
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [loading, file]);

  return (
    <div className="d-block">
      {file ? (
        loading ? (
          // loading component
          <Spinner animation="border" role="status" variant="secondary">
            <span className="sr-only">Loading</span>
          </Spinner>
        ) : (
          // thumbnail image component
          <Image src={thumbnail} thumbnail style={{ width }} />
        )
      ) : defaultSrc ? (
        // default image component
        <Image src={defaultSrc} thumbnail style={{ width }} />
      ) : (
        // none image component
        <div
          className="border border-grey rounded"
          style={{ width: 100, height: 100 }}
        ></div>
      )}
    </div>
  );
};

export default ImageThumbnail;
