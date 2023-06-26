import { config } from "dotenv";
import express from "express";
import { LootRoutes } from "./routes/loot.routes";
import { GearRoutes } from "./routes/gear.routes";
import cors from "cors";
import { RewardRoutes } from "./routes/reward.routes";
config();
var app = express();
var PORT = 8001;
app.use(cors());
app.use(express.json());
// Now we add the auth router to our app to set up the necessary auth routes
app.use("/loot", new LootRoutes().router);
app.use("/gear", new GearRoutes().router);
app.use("/rewards", new RewardRoutes().router);
app.use("/rewards", new StatsRoutes().router);
app.listen(PORT, function() {
    console.log("Server listening on port ".concat(PORT));
});
