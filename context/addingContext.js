import React, { createContext, useState } from 'react'

export const AddingContext=createContext();
export const AddingContextProvider=({children}) => {
    const [AddPressed,setAddPressed]=useState(false);
    const [background, setBackground] = useState({
            background_color: 'white',
            opacity: 1,
        });
  return (
    <AddingContext.Provider value={{AddPressed,setAddPressed,background,setBackground}}>
        {children}
    </AddingContext.Provider>
  )
}


