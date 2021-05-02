import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface IProps {
  setLoading: Function;
};

const Home: React.FC<IProps> = ({
  setLoading
}): JSX.Element => {

  useEffect(() => {
    setLoading(false);
    return () => {
      setLoading(null);
    }
  }, []);

  return (
    <div>
      <Helmet>
        <title>Home | Poro</title>
      </Helmet>
    </div>
  )
}

export default Home;