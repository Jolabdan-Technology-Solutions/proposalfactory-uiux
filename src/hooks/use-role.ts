import { useEffect, useState } from "react";
import { readActiveRole, type Role } from "@/lib/roles";

/** Reads the role chosen at sign-in. Null until hydrated. */
export function useActiveRole(): Role | null {
  const [role, setRole] = useState<Role | null>(null);
  useEffect(() => {
    setRole(readActiveRole());
  }, []);
  return role;
}
