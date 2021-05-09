export const classNames = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ')
}

export const durationParse = (duration: number) => {
  const m = Math.floor(duration / 60);
  const s = duration % 60;
  return `${m}분 ${s}초`
}

export const findDataById = (dataArray: any, id: number) => {
  if (dataArray) {
    for (const data in dataArray) {
      if (+dataArray[data].key === id) {
        return dataArray[data];
      }
    }
  }
  return {};
};