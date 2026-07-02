// Time offset between Server and Client (serverTime - localTime)
export let serverClockOffset = 0;

export const setServerClockOffset = (serverTimeStr: string) => {
  const serverTime = new Date(serverTimeStr).getTime();
  const localTime = Date.now();
  if (!isNaN(serverTime)) {
    serverClockOffset = serverTime - localTime;
  }
};

// Synchronize client clock with server clock offset
export const getSynchronizedTime = (): number => {
  return Date.now() + serverClockOffset;
};
