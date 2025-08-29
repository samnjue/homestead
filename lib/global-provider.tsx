//@ts-nocheck
import { createContext, ReactNode, useContext } from "react";
import { useAppwrite } from "./useAppwrite";
import { getCurrentUser } from "./appwrite";

interface User {
  $id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  refetch: (newParams?: Record<string, string | number>) => Promise<void>;
  initials: string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    loading,
    refetch,
  } = useAppwrite({
    fn: getCurrentUser,
  });

  const isLoggedIn = !!user;

  const getInitials = (name?: string) => {
    if (!name || typeof name !== "string") return "";
    const parts = name.trim().split(" ");
    return parts
      .map((p) => p[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const initials = getInitials(user?.name);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        user,
        loading,
        refetch,
        initials,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }

  return context;
};

export default GlobalProvider;
