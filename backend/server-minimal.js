import express from "express";

const app = express();
const PORT = 5004;

app.get("/api/check", (req, res) => {
    res.json({ status: "ok", message: "Simple Server Running" });
});

app.listen(PORT, () => {
    console.log(">>> SIMPLE SERVER RUNNING on http://localhost:" + PORT);
});
