export const getTestDbPort = () => {
  // default instance = thread4, e2e1 = thread1, etc
  const currentExecutorIndex = process.env.CYPRESS_THREAD || '4';

  switch (currentExecutorIndex) {
    // testdb-e2e1
    case '1':
      return 6532;
    // testdb-e2e2
    case '2':
      return 6533;
    // testdb-e2e3
    case '3':
      return 6534;
    // testdb
    default:
      return 6432;
  }
};
