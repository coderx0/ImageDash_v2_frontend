import React from 'react'
import Lottie from "lottie-react";
import newLoading from "./newLoading.json";


const LoadingV2 = () => {
  return (
    <Lottie
    className="h-[70vh]"
      animationData={newLoading}
    loop />
  )
}

export default LoadingV2