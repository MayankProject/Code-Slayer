import { getServerSession } from "next-auth";
import Home from "../components/Home";
import register from "@/actions/register";
import login from "@/actions/login";
export default async function() {
  return (
    <Home />
  );
}
