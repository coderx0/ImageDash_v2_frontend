import React from 'react'
import Lottie from "lottie-react";
import loading1 from "./loading1.json";


const Boring = () => {
  return (
    <Lottie
    className="h-[70vh]"
      animationData={loading1}
    loop />
  )
}

export default Boring