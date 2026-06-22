import { useEffect, useState } from "react";

export interface Account {
  name: string;
  email: string;
  signedInAt: string;
}

const KEY = "luxetech.account";

const read = (): Account | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const write = (acc: Account | null) => {
  if (acc) localStorage.setItem(KEY, JSON.stringify(acc));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("account:change"));
};

export const useAccount = () => {
  const [account, setAccount] = useState<Account | null>(() => read());

  useEffect(() => {
    const sync = () => setAccount(read());
    window.addEventListener("account:change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("account:change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const signIn = (name: string, email: string) =>
    write({ name, email, signedInAt: new Date().toISOString() });
  const signOut = () => write(null);

  return { account, signIn, signOut, isSignedIn: !!account };
};
