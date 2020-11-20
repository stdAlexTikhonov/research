import React from "react";

export const Context = React.createContext<{
  step: number;
  itog: Object;
  setItog: any;
} | null>(null);
