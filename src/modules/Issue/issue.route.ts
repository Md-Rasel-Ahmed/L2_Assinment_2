import { Router } from "express";
import { issueController } from "./issue.controller";
import { auth, roleAccess } from "../../middlewares/auth";

const route=Router()
route.post("/issues",auth(), issueController.postIssue)
route.get("/issues",issueController.getAllIssues)
route.get("/issues/:id",issueController.getSingleIssue)
route.put("/issues/:id",auth(),issueController.updateIssue)
route.delete("/issues/:id",roleAccess(),issueController.deleteIssue)
export const issueRoute=route