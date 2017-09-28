module.exports.filterExplanations = result => ({ score, text }) => {
  let range = score.split('-').map(d => +d);
  return (
    score === '' ||
    (range.length === 1 && result === range[0]) ||
    (range[0] <= result && range[1] >= result)
  );
};
