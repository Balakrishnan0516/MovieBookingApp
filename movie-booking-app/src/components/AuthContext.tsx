import React, { createContext, useContext, useState, ReactNode } from "react";

// Create AuthContext
interface AuthContextType {
  UsernameAuth: string;
  setUsernameAuth: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [UsernameAuth, setUsernameAuth] = useState<string>(""); // Update with actual username from your login system

  return (
    <AuthContext.Provider value={{ UsernameAuth, setUsernameAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
