import React from 'react';

const Card = ({ children, className }) => {
  return (
    <div className={`rounded-lg overflow-hidden bg-white bg-opacity-10 backdrop-blur-md ${className}`}>
      {children}
    </div>
  );
};

export default Card;
