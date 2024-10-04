"use client";
import { WebSocketManager } from "@/WebsocketManager";
import registerAndLogin from "../actions/registerAndLogin";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
export default function Authenticate({ children }: { children: React.ReactNode }) {
  const { status, data } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      registerAndLogin();
    }
    console.log(data)
  }, [status])
  return (
    <>{ children } </>
  );
}
