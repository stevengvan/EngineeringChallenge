import express, { Request, Response } from "express";
import { getMachineHealth } from "./machineHealth";
import { latestMachineState } from "./machineState";

const app = express();
const port = 3001;

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to get machine health score
app.post("/machine-health", (req: Request, res: Response) => {
  const result = getMachineHealth(req);
  if (result.error) {
    res.status(400).json(result);
  } else {
    res.json(result);
  }
});

// Endpoint to get latest machine state calculated and saved
app.get("/machine-state/latest", async (req: Request, res: Response) => {
  const result = await latestMachineState(req);
  if (result.error) {
    res.status(400).json(result.error);
  } else {
    res.status(200).json(result.data);
  }
});

app.listen(port, () => {
  console.log(`API is listening at http://localhost:${port}`);
});
