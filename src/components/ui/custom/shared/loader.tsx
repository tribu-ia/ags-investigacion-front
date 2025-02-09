'use client'

import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

type LoaderSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LoaderProps {
  mode?: 'light' | 'dark';
  size?: LoaderSize;
}

const sizeMap: Record<LoaderSize, string> = {
  xxs: 'h-8 w-8',
  xs: 'h-16 w-16',
  sm: 'h-24 w-24',
  md: 'h-32 w-32',
  lg: 'h-56 w-56',
  xl: 'h-72 w-72'
};

export const Loader: React.FC<LoaderProps> = ({ mode = 'dark', size = 'lg' }) => {
  return (
    <section className={sizeMap[size] + `${mode === 'light' && ' brightness-200'}`}>
      <DotLottieReact
        src="/loader-animation.lottie"
        loop
        autoplay
      />
    </section>
  )
}

export default Loader