const { h } = require('preact');
module.exports = ({ className, ariaHidden }) => {
  return (
    <svg
      aria-label="correct"
      className={className}
      aria-hidden={ariaHidden}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Tick</title>
      <g fill="none" fill-rule="evenodd">
        <path d="M0 0h24v24H0z" />
        <path d="M8.727 15.989l-4.295-4.296L3 13.125l5.727 5.727L21 6.58l-1.432-1.432z" />
      </g>
    </svg>
  );
};
