"use client";
import BottomNavigation from "@/components/BottomNavigation";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { RecoilRoot } from "recoil";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
    <RecoilRoot>
    { children }
    < BottomNavigation />
    </RecoilRoot>
    </SessionProvider>
  );
}
