import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";

export function authMiddleware(req: Request & { shopId?: string }, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { shopId: string };
    req.shopId = decoded.shopId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
