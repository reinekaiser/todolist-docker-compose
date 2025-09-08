import express from "express";
import { listAllTasks, createTask, updateTask, deleteTask } from "../controllers/taskController.js";

const router = express.Router();

router.get("/", listAllTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;