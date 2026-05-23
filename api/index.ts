import app from "../src/app";
import { initDBSafe } from "../src/config/db";

initDBSafe();

export default app;