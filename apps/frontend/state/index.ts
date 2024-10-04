import { atom } from "recoil";
import { Problem } from "@/components/Smackdown";
export const consoleText = atom<string>({
	key: "console",
	default: "",
});
export const testResult = atom<any>({
	key: "testResult",
	default: {},
});
export const allProblems = atom<(Problem & { testResult: any })[]>({
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
