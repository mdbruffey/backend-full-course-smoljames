import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes";
import todoRoutes from "./routes/todoRoutes";
import authMiddleware from "./middleware/authMiddleware";

const app = express();
const PORT = process.env.PORT || 4002;

//Get filepath rom the URL of the current module
const __filename = fileURLToPath(import.meta.url);
//Get the directory name from the filepath
const __dirname = path.dirname(__filename);

//Middleware
//Allows express to pass or interpret json
app.use(express.json());
//Serves the HTML file from the /public directory
//Also tells express to server all files from the public folder
app.use(express.static(path.join(__dirname, "../public")));

//Routes
app.use("/auth", authRoutes);
app.use("/todos",authMiddleware, todoRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
});
