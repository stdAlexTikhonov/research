import React from "react";

export const Context = React.createContext<{
  step: number;
  itog: any;
  setItog: any;
  showCrumbs: boolean;
  setShowCrumbs: any;
  data: any;
} | null>(null);
