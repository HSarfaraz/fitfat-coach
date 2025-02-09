import { users, type User, type InsertUser, type Progress, type Consultation } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: Omit<User, "id">): Promise<User>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<void>;
  deleteUserSessions(userId: number): Promise<void>;
  createProgress(progress: Omit<Progress, "id">): Promise<Progress>;
  getUserProgress(userId: number): Promise<Progress[]>;
  createConsultation(consultation: Omit<Consultation, "id">): Promise<Consultation>;
  getUserConsultations(userId: number): Promise<Consultation[]>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private progress: Map<number, Progress>;
  private consultations: Map<number, Consultation>;
  sessionStore: session.Store;
  currentId: number;
  currentProgressId: number;
  currentConsultationId: number;

  constructor() {
    this.users = new Map();
    this.progress = new Map();
    this.consultations = new Map();
    this.currentId = 1;
    this.currentProgressId = 1;
    this.currentConsultationId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(userData: Omit<User, "id">): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      id,
      username: userData.username,
      password: userData.password,
      email: userData.email,
      isAdmin: userData.isAdmin ?? false,
      phone: userData.phone ?? null,
      currentPackage: userData.currentPackage ?? null,
      packageStartDate: userData.packageStartDate ?? null,
      packageEndDate: userData.packageEndDate ?? null,
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async deleteUser(id: number): Promise<void> {
    // Delete all associated data
    this.users.delete(id);

    // Delete user's progress records
    for (const [progressId, progress] of this.progress.entries()) {
      if (progress.userId === id) {
        this.progress.delete(progressId);
      }
    }

    // Delete user's consultations
    for (const [consultationId, consultation] of this.consultations.entries()) {
      if (consultation.userId === id) {
        this.consultations.delete(consultationId);
      }
    }
  }

  async deleteUserSessions(userId: number): Promise<void> {
    // For MemoryStore, we need to destroy all sessions
    // This is a bit inefficient but necessary for memory store
    // In a real database, we would use a query to delete specific user sessions
    return new Promise((resolve) => {
      this.sessionStore.all((err, sessions) => {
        if (err || !sessions) {
          resolve();
          return;
        }

        for (const [sessionId, session] of Object.entries(sessions)) {
          if (session.passport?.user === userId) {
            this.sessionStore.destroy(sessionId, () => {});
          }
        }
        resolve();
      });
    });
  }

  async createProgress(data: Omit<Progress, "id">): Promise<Progress> {
    const id = this.currentProgressId++;
    const progress: Progress = { ...data, id };
    this.progress.set(id, progress);
    return progress;
  }

  async getUserProgress(userId: number): Promise<Progress[]> {
    return Array.from(this.progress.values()).filter(
      (progress) => progress.userId === userId
    );
  }

  async createConsultation(data: Omit<Consultation, "id">): Promise<Consultation> {
    const id = this.currentConsultationId++;
    const consultation: Consultation = { ...data, id };
    this.consultations.set(id, consultation);
    return consultation;
  }

  async getUserConsultations(userId: number): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).filter(
      (consultation) => consultation.userId === userId
    );
  }
}

export const storage = new MemStorage();