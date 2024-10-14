import CodeMirror from "@uiw/react-codemirror";
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { useEffect, useState } from "react";
import Pane from "./Pane";
import { useRecoilState, useRecoilValue } from "recoil";
import { WebSocketManager } from "@/WebsocketManager";
const ws = WebSocketManager.getInstance();
import { allProblems, currentProblem } from "@/state";
import { useSession } from "next-auth/react";

export default function Playground({ token }: { token: string }) {
    const session = useSession();
    const currentProblemIndex = useRecoilValue(currentProblem);
    const [Problems, setProblems] = useRecoilState(allProblems);
    const Problem = Problems[currentProblemIndex];
    const id = Problem?.id;
    const boilerplate = Problem?.boilerplate;
    const [code, setCode] = useState(boilerplate);
    useEffect(() => {
        setCode(boilerplate);
    }, [boilerplate]);

    function handleChangeMirror(value: string) {
        ws.sendMessage({
            method: "PUBLISH",
            param: {
                key: token,
                data: {
                    user_id: session?.data?.user?.id.toString() || "",
                    e: "UPDATE_CODE",
                    data: {
                        code: value,
                    }
                }
            }
        })
        setProblems((prev) => {
            return prev.map((problem) => {
                if (problem.id === id) {
                    problem.boilerplate = value;
                }
                return problem;
            })
        });
        setCode(value);
    }

    return (
        <Pane className="!overflow-hidden" >
            <div className='w-full  code-editor h-full overflow-auto' >
                <CodeMirror
                    value={code}
                    onChange={(value, viewUpdate) => {
                        handleChangeMirror(value);
                    }
                    }
                    className="bg-red-200 text-sm"
                    theme={vscodeDark}
                    extensions={[javascript()]}
                />
            </div>
        </Pane>
    );
}
