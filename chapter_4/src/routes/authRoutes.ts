import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db";

const router = express.Router();

interface User {
    id: number;
    username: string;
    password: string;
}

router.post("/login", (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            throw new Error("Missing username or password");

        const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`);
        const user = <User>getUser.get(username);

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
        res.status(200).json({token: token});
    } catch (error) {
        res.status(503).json({ error: error });
    }
});

router.post("/register", (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            throw new Error("Missing information required to create user");
        const hashedPassword = bcrypt.hashSync(password, 8);
        const insertUser = db.prepare(
            `INSERT INTO users (username, password) VALUES(?,?)`
        );
        const result = insertUser.run(username, hashedPassword);

        const defaultTodo = `Hello :) Add your first todo!`;
        const insertTodo = db.prepare(
            `INSERT INTO todos (user_id, task) VALUES (?,?)`
        );
        insertTodo.run(result.lastInsertRowid, defaultTodo);

        //create JWT token
        const key = process.env.JWT_SECRET || "default";
        const token = jwt.sign({ id: result.lastInsertRowid }, key, {
            expiresIn: "24h",
        });
        res.status(201).json({ token: token });
    } catch (error) {
        res.status(503).json({ error: error });
    }
});

export default router;
