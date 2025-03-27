import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.ts";
import { hash } from "crypto";
import prisma from "../prismaClient.ts";

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            throw new Error("Missing username or password");

        const user = await prisma.user.findUnique({
            where: { username: username },
        });

        //If no associated user, exit the function and return a 404
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        //If the password is incorrect, exit the function and return a 401
        if (!passwordIsValid) {
            res.status(401).json({ message: "Wrong password" });
            return;
        }

        //User is successfully authenticated
        const key = process.env.JWT_SECRET || "default";
        const token = jwt.sign({ id: user.id }, key, {
            expiresIn: "24h",
        });
        res.status(200).json({ token: token });
    } catch (error) {
        res.status(503).json({ error: error });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            throw new Error("Missing information required to create user");
        const hashedPassword = bcrypt.hashSync(password, 8);

        const user = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
            },
        });

        const defaultTodo = `Hello :) Add your first todo!`;
        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id,
            },
        });

        //create JWT token
        const key = process.env.JWT_SECRET || "default";
        const token = jwt.sign({ id: user.id }, key, {
            expiresIn: "24h",
        });
        res.status(201).json({ token: token });
    } catch (error) {
        res.status(503).json({ error: error });
    }
});

export default router;
