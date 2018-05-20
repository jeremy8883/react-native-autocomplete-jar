export const fetchResults = (query) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve([{
      text: `${query} - 1`,
      id: '1',
    }, {
      text: `${query} - 2`,
      id: '2',
    }, {
      text: `${query} - 3`,
      id: '3',
    }]);
  }, 500);
});
