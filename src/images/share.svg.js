const { h } = require('preact');
module.exports = ({ className }) => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Arrow icon</title>
      <g fill="none" fill-rule="evenodd">
        <path d="M0 0h24v24H0z" />
        <path
          d="M15 13.406S5.458 11.47 3.003 19.031c0 0-.438-11.25 11.999-11.25V4.97L21 10.594l-6 5.625v-2.813z"
          fill="#000"
        />
      </g>
    </svg>
  );
};
