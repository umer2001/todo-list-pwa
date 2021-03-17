module.exports = (acc, currElement) => {
  return {
    ...acc,
    [currElement.uid]: currElement,
  };
};
