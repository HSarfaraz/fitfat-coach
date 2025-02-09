import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertConsultationSchema, insertProgressSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Consultations
  app.post("/api/consultations", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const data = {
        ...req.body,
        userId: req.user.id,
        scheduledDate: new Date(req.body.scheduledDate),
        notes: req.body.notes || null
      };
      const validatedData = insertConsultationSchema.parse(data);
      const consultation = await storage.createConsultation(validatedData);
      res.json(consultation);
    } catch (error) {
      res.status(400).json({ message: "Invalid consultation data" });
    }
  });

  app.get("/api/consultations", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const consultations = await storage.getUserConsultations(req.user.id);
    res.json(consultations);
  });

  // Progress tracking
  app.post("/api/progress", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const data = {
        ...req.body,
        userId: req.user.id,
        date: new Date(req.body.date),
        notes: req.body.notes || null
      };
      const validatedData = insertProgressSchema.parse(data);
      const progress = await storage.createProgress(validatedData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data" });
    }
  });

  app.get("/api/progress", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const progress = await storage.getUserProgress(req.user.id);
    res.json(progress);
  });

  // Admin routes
  app.get("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) return res.sendStatus(401);
    const users = await storage.getAllUsers();
    res.json(users);
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) return res.sendStatus(401);
    const userId = parseInt(req.params.id);

    try {
      // Delete all sessions for this user
      await storage.deleteUserSessions(userId);
      // Delete the user
      await storage.deleteUser(userId);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}