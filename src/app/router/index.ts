import express from "express";
import { StudentRoutes } from "../modules/student.route";

const router = express.Router();

const routers = [
  {
    path: "/students",
    route: StudentRoutes,
  },
];

routers.forEach(item => router.use(item.path, item.route));

export default router;
