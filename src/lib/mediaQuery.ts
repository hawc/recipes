import { useMediaQuery } from 'react-responsive';

export function useDesktopMediaQuery() {
  return useMediaQuery({
    minWidth: 769,
  });
}
