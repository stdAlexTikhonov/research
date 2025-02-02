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
  shouldSkipp: any;
  skipped: string[];
  setSkipped: any;
  nextDsb: boolean;
  setNextDsb: any;
  localKeys: any;
  setLocalKeys: any;
  setData: any;
  setList: any;
  itogKeys: string[] | null;
  questionCode: string;
  setQuestionCode: any;
  setKeys: any;
  direction: number;
  setDirection: any;
} | null>(null);
