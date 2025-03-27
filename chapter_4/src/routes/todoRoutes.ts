import express from "express";
import prisma from "../prismaClient.ts";

const router = express.Router();

//Get all Todos for a user
router.get("/", async (req, res) => {
    try {
        const todos = await prisma.todo.findMany({
            where: { userId: req.body.userId },
        });
        res.json(todos);
    } catch (error) {
        res.status(503).json({ error: error });
    }
});

//Create Todo
router.post("/", async (req, res) => {
    //Should I consider checking that the user ID is legitimate? In this situation it's common
    //that a token I handed out persists after the server restarts and the user ceases to exist, lol.
    //I suppose it will error out anyway because the user ID is a foreign relation and won't exist
    //in the referenced table...
    try {
        await prisma.todo.create({
            data: {
                task: req.body.task,
                userId: req.body.userId,
            },
        });
        res.status(201).json({ message: "Task created" });
    } catch (error) {
        res.status(503).json({ error: error });
    }
});

//Update Todo
router.put("/:task_id", async (req, res) => {
    try {
        const { completed, userId } = req.body;
        const { task_id } = req.params;
        await prisma.todo.update({
            where: { id: parseInt(task_id) },
            data: { completed: !!completed },
        });
        res.status(200).json({
            message: `Task with id ${task_id} marked as ${
                completed ? "complete" : "incomplete"
            }`,
        });
    } catch (error) {
        res.status(503).json({ error: error });
    }
});

//Delete a Todo
router.delete("/:task_id", async (req, res) => {
    try {
        const { userId } = req.body;
        const { task_id } = req.params;
        await prisma.todo.delete({
            where: {
                id: parseInt(task_id),
                userId: parseInt(userId),
            },
        });
        res.status(200).json({ message: `Task with id ${task_id} deleted` });
    } catch (error) {
        res.status(503).json({ error: error });
    }
});

export default router;
