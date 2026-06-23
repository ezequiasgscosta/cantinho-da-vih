"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type UIContextType = {
  carrinhoAberto: boolean;
  setCarrinhoAberto: (value: boolean) => void;
};

const UIContext = createContext({} as UIContextType);

export function UIProvider({ children }: { children: ReactNode }) {
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  return (
    <UIContext.Provider value={{ carrinhoAberto, setCarrinhoAberto }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}