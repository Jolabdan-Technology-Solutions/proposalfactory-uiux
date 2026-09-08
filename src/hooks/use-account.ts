import { useEffect, useState } from "react";
import { readActiveAccount, type Account } from "@/lib/accounts";

/** Reads the signed-in account. Null until hydrated. */
export function useActiveAccount(): Account | null {
  const [account, setAccount] = useState<Account | null>(null);
  useEffect(() => {
    setAccount(readActiveAccount());
  }, []);
  return account;
}
