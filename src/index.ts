import express from "express";
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const app = express()

const db = drizzle({ connection: process.env.DATABASE_URL!, casing: "snake_case"});

app.use(express.json());

app.post("/users", async (req, res) => {
    res.status(200).json({ message: "User created successfully" });
})

app.delete("/users/:id", async (req, res) => {
    res.status(200).json({ message: "User deleted successfully" });
})

app.put("/users/:id", async (req, res) => {
    res.status(200).json({ message: "User updated successfully" });
})

const server = app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
})