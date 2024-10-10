"use client";
import { useRecoilValue } from "recoil";
import { loader } from "../state";

export default function Progressbar() {
	const LoaderData = useRecoilValue(loader)
	return (
		<div className="progress-bar-container h-1 w-full absolute top-0 left-0 flex justify-center items-center" >

			{LoaderData.percentage !== undefined && <div className={`progress-bar transition-all h-full bg-red-700 absolute left-0 `} style={{ width: `${LoaderData.percentage}%` }} >
			</div>
			}
		</div>
	)
}

