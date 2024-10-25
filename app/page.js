import Pomodoro from "@/app/pomodoro";
import { fetchVisitors } from "./lib/data";

export default async function Page() {
  const visitors = await fetchVisitors();

  return <Pomodoro />;
}