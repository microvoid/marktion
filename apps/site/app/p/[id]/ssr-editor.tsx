'use client';
import { ReactSSR, ReactSSRProps } from 'marktion';

export function SSREditor(props: ReactSSRProps) {
  return <ReactSSR {...props} />;
}
