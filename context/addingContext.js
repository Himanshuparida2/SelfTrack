import React, { createContext, useState } from 'react'

export const AddingContext=createContext();
export const AddingContextProvider=({children}) => {
    const [AddPressed,setAddPressed]=useState(false);
  return (
    <AddingContext.Provider value={{AddPressed,setAddPressed}}>
        {children}
    </AddingContext.Provider>
  )
}


