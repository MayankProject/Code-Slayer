import { atom } from "recoil";
import { Problem } from "@/components/Smackdown";
import { User } from "@/components/Lobby";
export const consoleText = atom<string>({
    key: "console",
    default: "",
});
export const tokenState = atom<string>({
    key: "token",
    default: ""
});
export const testResult = atom<any>({
    key: "testResult",
    default: {},
});
export const allProblems = atom<(Problem & { testResult: any, PassedTestCases: number[], FailedTestCases: number[] })[]>({
    key: "allProblems",
    default: [],
    dangerouslyAllowMutability: true
});
export const currentProblem = atom<number>({
    key: "currentProblem",
    default: 0
});
export const consoleVisible = atom<boolean>({
    key: "consoleVisible",
    default: false
});
export const allSpectatorsCode = atom<Map<string, string>>({
    key: "spectatorCode",
    default: new Map()
});
export const timeState = atom<number>({
    key: "timeLimit",
    default: 0
});
export const canSpectateState = atom<boolean>({
    key: "canSpectate",
    default: false
});
export const allUsersState = atom<User[]>({
    key: "allUsers",
    default: []
});
export const loader = atom<{
    percentage: number | undefined,
}>({
    key: "loader",
    default: {
        percentage: 0
    }
})
export const hideNavigationState = atom<boolean>({
    key: "hideNavigation",
    default: true
})
