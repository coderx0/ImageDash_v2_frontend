import React from 'react'
import Lottie from "lottie-react";
import notFound from "../public/notFound.json";

const NotFound = () => {
  return (
    <Lottie
    className="h-[70vh]"
      animationData={notFound}
    loop />
  )
}

export default NotFound