import React from 'react'
import Lottie from "lottie-react";
import loading from "./loading.json";


const LoadingV3 = () => {
  return (
    <Lottie
    className="h-[50vh]"
      animationData={loading}
    loop />
  )
}

export default LoadingV3