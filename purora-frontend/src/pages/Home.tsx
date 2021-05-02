import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';


const Home: React.FC = (): JSX.Element => {

  useEffect(() => {
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