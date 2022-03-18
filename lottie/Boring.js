import React from 'react'
import Lottie from "lottie-react";
import notFound from "../public/notFound.json";
import boring from "../public/boring.json";

const Boring = () => {
  return (
    <Lottie
    className="h-[70vh]"
      animationData={boring}
    loop />
  )
}

export default Boring