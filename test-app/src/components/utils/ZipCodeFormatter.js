import React from 'react';

const ZipCodeFormatter = ({ zipcode }) => {
  const formatZipcode = (zipcode) => {
    if (zipcode.length === 8) {
      return `${zipcode.substring(0, 5)}-${zipcode.substring(5)}`;
    }
    return zipcode;
  };

  return <span>{formatZipcode(zipcode)}</span>;
};

export default ZipCodeFormatter;
