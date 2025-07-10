import { title } from '@/components/primitives';
import React from 'react';

interface PageProps {
  params: { slug: string };
}

export default async function Page({ params }: PageProps) {
  return (
    <div>
      <h1 className={title()}>Something went wrong</h1>
      <br />
      <h2 className={title()}>
        You are not authorized to visit: <code>{params.slug}</code>
      </h2>
    </div>
  );
}
