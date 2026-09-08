import { useEffect, useState } from "react";
import { readActiveGoal, type Goal } from "@/lib/goals";

/** Reads the task the user chose after signing in. Null until hydrated. */
export function useActiveGoal(): Goal | null {
  const [goal, setGoal] = useState<Goal | null>(null);
  useEffect(() => {
    setGoal(readActiveGoal());
  }, []);
  return goal;
}
