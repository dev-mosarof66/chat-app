import { createSlice } from "@reduxjs/toolkit";


const themeSlice = createSlice({
    name: "theme",
    initialState: {
        isDarkMode: 'dark',
    },
    reducers: {
        toggleTheme: (state) => {
            if (state.isDarkMode === 'dark')
                state.isDarkMode = 'light'
            else
                state.isDarkMode = 'dark'
        },
        setTheme: (state, action) => {
            state.isDarkMode = action.payload
        }
    }
})

export const { toggleTheme, setTheme } = themeSlice.actions

export default themeSlice.reducer