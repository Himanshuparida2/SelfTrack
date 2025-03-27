import React, { createContext, useState } from 'react'

export const AddingContext=createContext();
export const AddingContextProvider=({children}) => {
    const [AddPressed,setAddPressed]=useState(false);
    const [subject,setSubject]=useState('')
    const [edit,setEdit]=useState(false)
    const [opensidebar,setOpenSideBar]=useState(false)
    const [background, setBackground] = useState({
            background_color: 'white',
            opacity: 1,
        });
  return (
    <AddingContext.Provider value={{AddPressed,setAddPressed,background,setBackground,subject,setSubject,setEdit,edit,setOpenSideBar,opensidebar}}>
        {children}
    </AddingContext.Provider>
  )
}


