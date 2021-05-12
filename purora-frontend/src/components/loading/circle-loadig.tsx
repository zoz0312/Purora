import SpinenerCircle from "../../style/circle";
import React from "react";

interface CircleLoadingProps {
  isLoading: boolean;
};

const CircleLoading: React.FC<CircleLoadingProps> = (
  {
    isLoading,
    children,
  }
) => {
  if (isLoading) {
    return <SpinenerCircle className={'w-6 h-6 text-white text-center mx-auto'}/>
  }
  return (
    <>
      { children }
    </>
  )
};

export default CircleLoading;
