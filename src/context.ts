import React from "react";

export const Context = React.createContext<{
  step: number;
  itog: any;
  setItog: any;
  showCrumbs: boolean;
  setShowCrumbs: any;
  data: any;
  keys: string[] | null;
  uuid: string;
  setStep: any;
  dir: number;
  setDir: any;
  shouldSkipp: any;
  skipped: string[];
  setSkipped: any;
  nextDsb: boolean;
  setNextDsb: any;
} | null>(null);
