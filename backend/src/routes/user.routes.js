import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
  getMe,
  fetchAllUser
} from "../controllers/user.controllers.js";
import { middleware } from "../middleware/middleware.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.route('/register').post(createUser)
router.route('/login').post(loginUser)
router.route('/me').get(middleware, getMe)
router.route('/logout').post(middleware, logoutUser)
router.route('/delete').delete(middleware, deleteUser)
router.route('/all-user').get(middleware, fetchAllUser)
router.route('/update').put(middleware, upload.single('avatar'), updateUser)
export default router;
