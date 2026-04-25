'use client';

import ColgatePage from "@/components/Mainpage";
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return <ColgatePage />;
}