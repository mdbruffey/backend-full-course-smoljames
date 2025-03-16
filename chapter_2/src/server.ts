import express from "express";

const app = express();
const PORT = 4001;

const data = ["Matthew"]
//middlewares
app.use(express.json());

//routes
app.get("/", (req, res) => {
    res.send(`
        <body
        style="background:pink;
        color:blue;">
        <h1>Home</h1>
        </body>
        `);
});

app.get("/dashboard", (req, res) => {
    res.status(200);
    res.send("Hello.");
});

app.get("/api/data", (req, res) => {
    res.send(`
        <body
        style="background:pink;
        color:blue;">
        <h1>Data</h1>
        ${JSON.stringify(data)}
        </body>
        `);
});

app.post("/api/data", (req, res) => {
    const newEntry = req.body;
    console.log(newEntry);
    data.push(newEntry.name)
    res.sendStatus(201);
});

app.delete("/api/data", (req, res) => {
    data.pop();
    res.sendStatus(204);
})

app.listen(PORT, () => {
    console.log(`Server has started on http://localhost:${PORT}`);
});
