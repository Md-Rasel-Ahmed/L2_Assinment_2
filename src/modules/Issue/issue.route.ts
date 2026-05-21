import { Router } from "express";
import { issueController } from "./issue.controller";
import { auth } from "../../middlewares/auth";

const route=Router()
route.post("/issues",auth(), issueController.postIssue)
route.get("/issues",issueController.getAllIssues)
route.get("/issues/:id",issueController.getSingleIssue)
export const issueRoute=route