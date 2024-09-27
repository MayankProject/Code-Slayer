import { atom } from "recoil";

export const consoleText = atom<string>({
	key: "console",
	default: "",
});
export const testResult = atom<any>({
	key: "testResult",
	default: {},
});
