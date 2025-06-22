import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";


type AuthcontextType = {
    session: Session | null;
    user: User | undefined;
}

const Authcontext = createContext<AuthcontextType>({
    session: null,
    user: undefined,
});

export default function AuthContextProvider({children}: PropsWithChildren){

    const [session, setSession] = useState<Session | null>(null)
    useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

    return <Authcontext.Provider value={{session, user: session?.user}}>{children}</Authcontext.Provider>
}

export const useAuth = () => useContext(Authcontext);