import React from 'react'
import Lottie from "lottie-react";
import photographer from "./photographer.json";


const Photographer = () => {
  return (
    <Lottie
    className="h-[50vh]"
      animationData={photographer}
    loop />
  )
}

export default Photographer