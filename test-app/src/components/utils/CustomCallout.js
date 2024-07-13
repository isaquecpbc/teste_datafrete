import React from 'react';

const CustomCallout = ({ children, variant }) => {
    const calloutClass = `bd-callout bd-callout-${variant}`;

    return (
        <div className={calloutClass}>
            {children}
        </div>
    );
};

export default CustomCallout;
