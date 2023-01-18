import { useDesktopMediaQuery } from '@/lib/mediaQuery';

export function Desktop({ children }) {
  return <>{useDesktopMediaQuery() ? children : null}</>;
}

export function Mobile({ children }) {
  return <>{useDesktopMediaQuery() ? null : children}</>;
}
