'use client'

import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const Loader = () => {
  return (
    <section className='h-56 w-56'>
      <DotLottieReact
        src="/loader-animation.lottie"
        loop
        autoplay
      />
    </section>
  )
}

export default Loader