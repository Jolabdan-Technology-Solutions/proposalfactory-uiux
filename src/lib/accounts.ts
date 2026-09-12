import { ROLE_BY_ID, setActiveRole, type Role, type RoleId } from "./roles";

/**
 * One account can hold many roles (one-to-many). Sign-in is by account.
 * If the account holds a single role we go straight into that environment;
 * only multi-role accounts are asked which role they are entering as.
 */
export type Account = {
  email: string;
  name: string;
  org: string;
  roles: RoleId[];
};

export const ACCOUNTS: Account[] = [
  {
    email: "owner@example.com",
    name: "Platform Owner",
    org: "Platform Operator",
    roles: ["platform-owner-admin"],
  },
  {
    email: "superadmin@example.com",
    name: "Super Administrator",
    org: "Platform Operator",
    roles: ["super-admin"],
  },
  {
    email: "admin@example.com",
    name: "Multi-Role Administrator",
    org: "Platform Operator",
    roles: ["super-admin", "platform-owner-admin", "proposal-manager"],
  },
  {
    email: "tenantadmin@example.com",
    name: "Sub-Tenant Administrator",
    org: "Tenant Organisation",
    roles: ["super-admin"],
  },
  {
    email: "user@example.com",
    name: "Sub-Tenant User",
    org: "Tenant Organisation",
    roles: ["subtenant-user"],
  },
];

const KEY = "tpf.account";

export function findAccount(email: string): Account | null {
  const e = email.trim().toLowerCase();
  return ACCOUNTS.find((a) => a.email === e) ?? null;
}

export function accountRoles(account: Account): Role[] {
  return account.roles.map((id) => ROLE_BY_ID[id]).filter(Boolean);
}

export function setActiveAccount(account: Account) {
  try {
    localStorage.setItem(KEY, account.email);
  } catch {
    /* ignore */
  }
  const only = account.roles[0];
  if (account.roles.length === 1 && only) setActiveRole(only);
}

export function readActiveAccount(): Account | null {
  try {
    const email = localStorage.getItem(KEY);
    return email ? findAccount(email) : null;
  } catch {
    return null;
  }
}

export function clearActiveAccount() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
