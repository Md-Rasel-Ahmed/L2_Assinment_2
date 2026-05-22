import { Router } from "express";
import { issueController } from "./issue.controller";
import { auth, maintainerAccess } from "../../middlewares/auth";

const route=Router()
route.post("/issues",auth(), issueController.postIssue)
route.get("/issues",issueController.getAllIssues)
route.get("/issues/:id",issueController.getSingleIssue)
route.put("/issues/:id",auth(),issueController.updateIssue)
route.delete("/issues/:id",auth(),maintainerAccess(),issueController.deleteIssue)
export const issueRoute=route