import React, { createContext } from "react";

export interface IAppContext {
  showSettings: boolean;
}

const defaultContext: IAppContext = {
  showSettings: false,
};

const AppContext = createContext<IAppContext>(defaultContext);

export default AppContext;
