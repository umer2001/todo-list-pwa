module.exports = (acc, currElement) => {
  return {
    ...acc,
    [currElement._id]: currElement,
  };
};
