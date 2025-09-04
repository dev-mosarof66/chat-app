import { Router } from "express";
import { middleware } from '../middleware/middleware.js'
import {
    createChat,
    sendMessage,
    deleteChat,
    deleteMessage,
    fetchChats,
    fetchLastMessage
} from '../controllers/chat.controllers.js'

const router = Router()

router.route('/create-chat/:id').post(middleware, createChat)
router.route('/send-message/:id').post(middleware, sendMessage)
router.route('/delete-message/:id').delete(middleware, deleteChat)
router.route('/delete-chat/:id').post(middleware, deleteChat)
router.route('/:id').get(middleware, fetchChats)
router.route('/last-message/:id').get(middleware, fetchLastMessage)

export default router