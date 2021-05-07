import { useState, useEffect } from 'react';

interface IUseScrollPage {
  page: number;
  setTotalPages: Function;
}

const useScrollPage = (
  initPage: number
): IUseScrollPage => {
  const [page, setPage] = useState(initPage);
  const [totalPage, setTotalPage] = useState(0);
  const [state, setState] = useState({
    x: 0,
    y: 0,
    screenY: 0,
  });

  const onScroll = (event: Event) => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const screenY = scrollHeight - clientHeight;
    setState({
      x: Math.ceil(window.scrollX),
      y: Math.ceil(window.scrollY),
      screenY,
    });
  }

  const setTotalPages = (totalPages: number) => {
    if (totalPage === 0) {
      setTotalPage(totalPages);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  }, []);


  useEffect(() => {
    if (state.y === 0 && state.screenY === 0) {
      return;
    }
    if (state.y === state.screenY) {
      state.y -= 10;
      if (page < totalPage) {
        setPage(current => current + 1);
      }
    }
  }, [state, totalPage, page]);

  return { page, setTotalPages };
}

export default useScrollPage;