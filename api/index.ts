import app from "../src/app.js";
import { initDBSafe } from "../src/config/db.js";

initDBSafe();

export default app;