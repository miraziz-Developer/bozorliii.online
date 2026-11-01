import type { ReactNode } from "react";

/**
 * Page template. The previous clip-path wipe transition hid content until the
 * animation finished (and on slow devices, longer); pages now render immediately.
 */
export default function PageTemplate({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
