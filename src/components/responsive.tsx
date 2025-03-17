"use client";

import { useDesktopMediaQuery } from "@/lib/mediaQuery";
import {
  PropsWithChildren, ReactNode,
} from "react";

export function Desktop({
  children, 
}: PropsWithChildren): ReactNode {
  return <>{useDesktopMediaQuery() ? children : null}</>;
}

export function Mobile({
  children, 
}: PropsWithChildren): ReactNode {
  return <>{useDesktopMediaQuery() ? null : children}</>;
}
