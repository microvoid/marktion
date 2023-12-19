import React from 'react';

export function BasicLayout({ children }: React.PropsWithChildren) {
  return <div className="max-w-screen-lg w-full px-2 m-auto">{children}</div>;
}
