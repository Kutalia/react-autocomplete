import { useEffect, useState } from 'react';

const breakPoint = 600;

export enum ScreenSizes {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
};

const useWindowResize = () => {
  const getScreenSize = () => {
    const screenWidth = window.innerWidth;

    return screenWidth > breakPoint ? ScreenSizes.DESKTOP : ScreenSizes.MOBILE;
  }

  const [screenSize, setScreenSize] = useState<ScreenSizes>(getScreenSize.call(window));

  useEffect(() => {
    const handler = () => {
      setScreenSize(getScreenSize());
    }

    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    }
  }, []);

  return screenSize;
};

export default useWindowResize;
