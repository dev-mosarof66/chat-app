import { configureStore } from "@reduxjs/toolkit";
import theme from '../features/theme'
import io from '../features/io'
import user from '../features/user'
import chat from '../features/chat'
export const store = configureStore({
    reducer: {
        theme,
        io,
        user,
        chat
    }
})


