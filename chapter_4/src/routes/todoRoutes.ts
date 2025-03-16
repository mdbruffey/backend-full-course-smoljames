import express from "express";
import db from "../db";
import { get } from "http";

const router = express.Router();

router.get("/", (req, res) => {
    try {
        const getTodos = db.prepare(`SELECT * FROM todos WHERE user_id = ?`);
        const todos = getTodos.all(req.body.userId);
        res.json(todos);
    } catch (error) {
        res.status(503).json({ error: error });
    }
});

router.post("/", (req, res) => {
    //Should I consider checking that the user ID is legitimate? In this situation it's common
    //that a token I handed out persists after the server restarts and the user ceases to exist, lol.
    //I suppose it will error out anyway because the user ID is a foreign relation and won't exist
    //in the referenced table...
    try {
        const insertTodo = db.prepare(
            `INSERT INTO todos (user_id, task) VALUES(?,?)`
        );
        const result = insertTodo.run(req.body.userId, req.body.task);
        res.status(201).json({ message: "Task created" });
    } catch (error) {
        res.status(503).json({ error: error });
    }
});

router.put("/:task_id", (req, res) => {
    try {
        const { completed, userId } = req.body;
        const { task_id } = req.params;
        const updateTodo = db.prepare(
            `UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?`
        );
        const result = updateTodo.run(completed, task_id, userId);
        res.status(200).json({
            message: `Task with id ${task_id} marked as ${
                completed ? "complete" : "incomplete"
            }`,
        });
    } catch (error) {
        res.status(503).json({ error: error });
    }
});

router.delete("/:task_id", (req, res) => {
    try {
        const { userId } = req.body;
        const { task_id } = req.params;
        const delTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`);
        const result = delTodo.run(task_id, userId);
        res.status(200).json({message: `Task with id ${task_id} deleted`})
    } catch (error) {
        res.status(503).json({ error: error });
    }
});

export default router;
