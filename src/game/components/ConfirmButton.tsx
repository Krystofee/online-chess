import React, { useState } from 'react';

type Props = {
  label: string;
  onClick: () => void;
};

const ConfirmButton = ({ label, onClick }: Props) => {
  const [confirming, setConfirming] = useState(false);

  const activateConfirm = () => {
    setConfirming(true);
  };

  const deactivateConfirm = () => {
    setConfirming(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    onClick();
  };

  return confirming ? (
    <div className="btn cursor-default m-3 text-center" role="presentation" onClick={deactivateConfirm}>
      {label}
      <button className="btn confirm" type="button" onClick={handleClick}>
        <span role="img" aria-label="Yes">
          ✔️
        </span>
      </button>
    </div>
  ) : (
    <button className="btn m-3" type="button" onClick={activateConfirm}>
      {label}
    </button>
  );
};

export default ConfirmButton;
