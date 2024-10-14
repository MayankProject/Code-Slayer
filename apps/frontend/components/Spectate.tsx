"use client";

import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { loader } from "@/state";
import SpectatorCode from "./SpectatorCode";
import Tabs from "./Tabs";
export default function Spectate({ usersDetails }: { usersDetails: any[] }) {
    const setLoader = useSetRecoilState(loader);
    useEffect(() => {
        setLoader({ percentage: undefined });
    }, []);
    return (
        <>
            <div className="container relative mx-auto p-3 h-1 w-full min-h-[60vh]">
                <Tabs
                    TabHead={
                        usersDetails.map((user) => (
                            {
                                title: user.name,
                                key: user.id
                            }
                        ))
                    }
                    TabContent={
                        usersDetails.map((user) => (
                            {
                                key: user.id,
                                content: (
                                    <SpectatorCode id={user.id} key={user.id} />
                                )
                            }
                        ))
                    }
                />
            </div>
        </>
    );
}
