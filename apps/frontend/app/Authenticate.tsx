"use client";
import checkUserExist from "@/actions/checkUserExist";
import registerAndLogin from "../actions/registerAndLogin";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
export default function Authenticate({ children }: { children: React.ReactNode }) {
  const { status, data } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      registerAndLogin();
    }
    else if (status === "authenticated") {
      checkUserExist(data?.user?.id)
        .then(exist => {
          if (!exist) {
            signOut();
          }
        })
    }
  }, [status])
  return (
    <>{ children } </>
  );
}
