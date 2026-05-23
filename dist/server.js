

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/app.ts
import express from "express";

// src/middlewares/globarErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err ? err.message : "Something went wrong!"
    //  stack:err.stack
  });
};
var globarErrorHandler_default = globalErrorHandler;

// src/modules/user/user.route.ts
import { Router } from "express";

// src/modules/user/user.service.ts
import "bcryptjs";

// src/config/db.ts
import { Pool } from "pg";

// src/config/config.ts
import "dotenv/config";
var config = {
  connection_string: process.env.CONNECTION_STRING,
  jwt_secret: process.env.JWT_SECRET
};
var config_default = config;

// src/config/db.ts
var pool = new Pool({
  connectionString: config_default.connection_string
});
var initDB = async () => {
  await pool.query(`
          CREATE TABLE IF NOT EXISTS users(
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'contributor'
          CHECK(role IN ('contributor','maintainer')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ) 
        `);
  await pool.query(`
          CREATE TABLE IF NOT EXISTS issues(
          id SERIAL PRIMARY KEY,
          title VARCHAR(150) NOT NULL,
          description TEXT
          CHECK(char_length(description) >= 20) NOT NULL,
          type TEXT
          CHECK(type IN ('bug','feature_request')) NOT NULL,
          status TEXT DEFAULT 'open',
          CHECK(status IN ('open','in_progress','resolved')),
          reporter_id INT REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ) 
        `);
  console.log("database connection success");
};

// src/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.status).json({
    success: data.success,
    message: data.message,
    data: data.data
  });
};
var sendResponse_default = sendResponse;

// src/modules/user/user.route.ts
var route = Router();
var userRouter = route;

// src/modules/auth/auth.router.ts
import { Router as Router2 } from "express";

// src/modules/auth/auth.service.ts
import bcrypt2 from "bcryptjs";
import "jsonwebtoken";
import "dotenv/config";

// src/utils/jwt.ts
import Jwt from "jsonwebtoken";
var createToken = (payload) => {
  return Jwt.sign(payload, config_default.jwt_secret, { expiresIn: "10d" });
};
var verifyJwt = (token) => {
  return Jwt.verify(token, config_default.jwt_secret);
};
var verify_token = async (token) => {
  const validToken = verifyJwt(token);
  if (!token || !validToken) {
    throw new Error("Unauthorized access");
  }
  const findUserFromDb = await pool.query(`
      SELECT * FROM users WHERE id=$1
      `, [validToken.id]);
  const user = findUserFromDb.rows[0];
  console.log(user, "token");
  if (validToken?.id !== user?.id) {
    throw new Error("Forbidden access");
  }
  return validToken;
};

// src/modules/auth/auth.service.ts
var loginUser = async (payload) => {
  const { email, password: paloadPass } = payload;
  const result = await pool.query(`
      SELECT * FROM users WHERE email=$1

    `, [email]);
  const user = result.rows[0];
  if (!user) {
    throw new Error("Invalid credintials!");
  }
  const matchPassword = await bcrypt2.compare(paloadPass, user.password);
  if (!matchPassword) {
    throw new Error("Invalid credintials!");
  }
  const { password, ...data } = user;
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role
  };
  const token = createToken(jwtPayload);
  return { token, user: data };
};
var SingupUserIntoDB = async (payload) => {
  const { name, email, password, role } = payload;
  const hashPassowrd = await bcrypt2.hash(password, 10);
  try {
    let result;
    if (role === "") {
      throw new Error("Role must be contributor or maintainer");
    }
    if (role) {
      const insertUser = await pool.query(`
      INSERT INTO users(name,email,password,role)
      VALUES($1,$2,$3,$4)
      RETURNING *
    `, [name, email, hashPassowrd, role]);
      result = insertUser;
    } else {
      const insertUser = await pool.query(`
      INSERT INTO users(name,email,password)
      VALUES($1,$2,$3)
      RETURNING *
    `, [name, email, hashPassowrd]);
      result = insertUser;
    }
    const insertedData = result.rows[0];
    const { password: password2, ...data } = insertedData;
    return data;
  } catch (error) {
    throw Error(error instanceof Error ? error.message : "Something went wrong");
  }
};
var authService = {
  loginUser,
  SingupUserIntoDB
};

// src/modules/auth/auth.controller.ts
var loginUser2 = async (req, res) => {
  const result = await authService.loginUser(req.body);
  if (result) {
    return sendResponse_default(res, { message: "Login successful", status: 200, success: true, data: result });
  }
  return sendResponse_default(res, { message: "User not found", status: 404, success: false });
};
var singUpUser = async (req, res) => {
  const result = await authService.SingupUserIntoDB(req.body);
  if (!result.email) {
    return sendResponse_default(res, { message: "User can,t created please try again", status: 400, success: false, data: {} });
  }
  return sendResponse_default(res, { message: "User registered successfully", status: 201, success: true, data: result });
};
var authController = {
  loginUser: loginUser2,
  singUpUser
};

// src/modules/auth/auth.router.ts
var router = Router2();
router.post("/auth/login", authController.loginUser);
router.post("/auth/signup", authController.singUpUser);
var authRouter = router;

// src/modules/Issue/issue.route.ts
import { Router as Router3 } from "express";

// src/modules/Issue/issue.service.ts
import "process";

// src/utils/join.ts
var getSingleIssue = async (id, repoer_id) => {
  console.log(id);
  const result = await pool.query(`
             SELECT * FROM issues WHERE id=$1
            `, [id]);
  const data = result.rows[0];
  console.log(data);
  const repoter = await pool.query(`
             SELECT id, name, role FROM users WHERE id=$1
            `, [repoer_id]);
  delete data.reporter_id;
  data.reporter = repoter.rows[0];
  return data;
};

// src/modules/Issue/issue.service.ts
var postIssueIntoDB = async (payload, reqUser) => {
  const { description, title: title2, type } = payload;
  try {
    const result = await pool.query(`
      INSERT INTO issues(title,description,type,reporter_id)
      VALUES($1,$2,$3,$4)
      RETURNING *
    `, [title2, description, type, reqUser.id]);
    return result;
  } catch (error) {
    throw new Error("Issue can not create");
  }
};
var getAllIssueFromDB = async (payload) => {
  const { sort = "newest", type, status } = payload;
  try {
    let queryText = `SELECT * FROM issues WHERE 1=1`;
    const queryParams = [];
    let paramIndex = 1;
    if (type && type !== "none") {
      queryText += ` AND type = $${paramIndex}`;
      queryParams.push(type);
      paramIndex++;
    }
    if (status && status !== "none") {
      queryText += ` AND status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }
    if (sort === "oldest") {
      queryText += ` ORDER BY created_at ASC`;
    } else {
      queryText += ` ORDER BY created_at DESC`;
    }
    const result = await pool.query(queryText, queryParams);
    const data = result.rows;
    if (data.length === 0) return [];
    const reporterIds = [];
    for (const row of data) {
      if (row.reporter_id && !reporterIds.includes(row.reporter_id)) {
        reporterIds.push(row.reporter_id);
      }
    }
    let allReporters = [];
    if (reporterIds.length > 0) {
      const idString = reporterIds.join(",");
      const reporterResult = await pool.query(`
                SELECT id, name, role FROM users WHERE id IN (${idString})
            `);
      allReporters = reporterResult.rows;
    }
    const allIssues = [];
    for (const issue of data) {
      const reporter = allReporters.find((r) => r.id === issue.reporter_id);
      if (reporter) {
        delete issue.reporter_id;
        issue.reporter = reporter;
      } else {
        issue.reporter = null;
      }
      allIssues.push(issue);
    }
    return allIssues;
  } catch (error) {
    throw new Error("Does not fetch data!");
  }
};
var getSingleIssueFromDB = async (id) => {
  try {
    const result = await pool.query(`
            SELECT * FROM issues WHERE id= $1
            `, [id]);
    const data = await getSingleIssue(id, result.rows[0].reporter_id);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Does not fetch data!");
  }
};
var updateIssuFromDB = async (payload, id, user) => {
  const { title: title2, description } = payload;
  try {
    let result;
    if (user.role === "maintainer") {
      const update = await pool.query(`
         UPDATE issues
         SET title =$1, description =$2, status ='in_progress'
         WHERE id =$3
         RETURNING *
        `, [title2, description, id]);
      result = update.rows[0];
    } else {
      const findIssue = await pool.query(`
            SELECT * FROM issues WHERE id=$1 AND reporter_id=$2
            `, [id, user.id]);
      if (findIssue.rows[0].status === "open") {
        const update = await pool.query(`
         UPDATE issues
         SET title =$1, description =$2, status ='in_progress', updated_at =$3
         WHERE id =$4
         RETURNING *
        `, [title2, description, /* @__PURE__ */ new Date(), id]);
        result = update.rows[0];
      } else {
        throw new Error("The issue is progress can,t update");
      }
    }
    return result;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};
var deleteIssueFromDB = async (id) => {
  try {
    const result = await pool.query(`
         DELETE FROM issues WHERE id=$1;
        `, [id]);
    console.log(result);
    return result;
  } catch (error) {
    throw new Error("Not founded");
  }
};
var issueService = {
  postIssueIntoDB,
  getAllIssueFromDB,
  getSingleIssueFromDB,
  updateIssuFromDB,
  deleteIssueFromDB
};

// src/modules/Issue/issue.controller.ts
import "jsonwebtoken";
var postIssue = async (req, res) => {
  const result = await issueService.postIssueIntoDB(req.body, req.user);
  const post = result.rows[0];
  if (result) {
    sendResponse_default(res, { message: "Issue created successfully", status: 201, success: true, data: post });
  }
};
var getAllIssues = async (req, res) => {
  const result = await issueService.getAllIssueFromDB(req.query);
  sendResponse_default(res, { message: "Data fetched success", status: 200, success: true, data: result });
};
var getSingleIssue2 = async (req, res) => {
  const { id } = req.params;
  const result = await issueService.getSingleIssueFromDB(Number(id));
  if (result) {
    return sendResponse_default(res, { status: 200, success: true, data: result });
  }
  return sendResponse_default(res, { message: "Not founded", status: 404, success: false, data: {} });
};
var updateIssue = async (req, res) => {
  const { id } = req.params;
  console.log(req.user);
  const result = await issueService.updateIssuFromDB(req.body, Number(id), req.user);
  console.log(result);
  if (result) {
    return sendResponse_default(res, { message: "Issue updated successfully", status: 200, success: true, data: result });
  }
  return sendResponse_default(res, { message: "Not founded", status: 404, success: false, data: {} });
};
var deleteIssue = async (req, res) => {
  const { id } = req.params;
  const result = await issueService.deleteIssueFromDB(Number(id));
  if (result.rowCount === 1) {
    return sendResponse_default(res, { message: "Issue delete successfully", status: 200, success: true });
  }
  return sendResponse_default(res, { message: "Issue not founded", status: 404, success: false });
};
var issueController = {
  postIssue,
  getAllIssues,
  getSingleIssue: getSingleIssue2,
  updateIssue,
  deleteIssue
};

// src/middlewares/auth.ts
var auth = () => {
  return async (req, res, next) => {
    const token = req.headers.authorization;
    const validToken = await verify_token(token);
    req.user = validToken;
    next();
  };
};
var maintainerAccess = () => {
  return (req, res, next) => {
    console.log(req.user, "acchess role middleware");
    if (req.user.role === "maintainer") {
      next();
    } else {
      throw new Error("Your are not allowed  to delete");
    }
  };
};

// src/modules/Issue/issue.route.ts
var route2 = Router3();
route2.post("/issues", auth(), issueController.postIssue);
route2.get("/issues", issueController.getAllIssues);
route2.get("/issues/:id", issueController.getSingleIssue);
route2.put("/issues/:id", auth(), issueController.updateIssue);
route2.delete("/issues/:id", auth(), maintainerAccess(), issueController.deleteIssue);
var issueRoute = route2;

// src/app.ts
var app = express();
app.use(express.json());
app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", issueRoute);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Database connected successfull"
  });
});
app.use(globarErrorHandler_default);
var app_default = app;

// src/server.ts
var port = process.env.PORT || 5e3;
initDB();
app_default.listen(port, () => {
  console.log("Server is running on this port", port);
});
//# sourceMappingURL=server.js.map