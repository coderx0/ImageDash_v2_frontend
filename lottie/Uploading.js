import React from 'react'
import Lottie from "lottie-react";
import uploading from "./uploading.json";


const Uploading = () => {
  return (
    <Lottie
    className="h-[50vh]"
      animationData={uploading}
    loop />
  )
}

export default Uploading