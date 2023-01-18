import { useDesktopMediaQuery } from '@/lib/mediaQuery';

export function Desktop({ children }: { children: JSX.Element }): JSX.Element {
  return <>{useDesktopMediaQuery() ? children : null}</>;
}

export function Mobile({ children }: { children: JSX.Element }): JSX.Element {
  return <>{useDesktopMediaQuery() ? null : children}</>;
}
