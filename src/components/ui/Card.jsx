const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`rounded-2xl bg-gray-800 shadow-lg overflow-hidden ${className}`}
      onClick={onClick} 
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick()}
    >
      {children}
    </div>
  );
};

export default Card;
