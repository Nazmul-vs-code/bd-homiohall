import { betterAuth } from "better-auth";
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { db } from './db.js';

const AUTH_FILE = path.join(process.cwd(), 'data', 'auth_sessions.json');

export interface StoredSession {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
    image?: string;
  };
  expiresAt: number;
}

function getStoredSessions(): StoredSession[] {
  if (fs.existsSync(AUTH_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
    } catch {
      return [];
    }
  }
  return [];
}

function saveStoredSessions(sessions: StoredSession[]) {
  try {
    const dir = path.dirname(AUTH_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(AUTH_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write auth sessions', e);
  }
}

export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "khalekbiton1977@gmail.com").toLowerCase().trim();
export const OWNER_NAME = "Dr. Tamjid Hossain (ডা. তামজীদ হোসেন)";

// Initialize Better Auth instance
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "ydQ6Myo5VeiKsr6jhO1cIaEaQZ40jEf1",
  baseURL: process.env.BETTER_AUTH_URL || process.env.APP_URL || "http://localhost:3000"
});

// Password helpers
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Helper to create session
export function createUserSession(user: { id: string; email: string; name: string; role: 'admin' | 'user'; image?: string }): StoredSession {
  const token = "bhh_sess_" + crypto.randomBytes(32).toString('hex');
  const sessions = getStoredSessions().filter(s => s.expiresAt > Date.now());
  const newSession: StoredSession = {
    token,
    user: {
      id: user.id,
      email: user.email.toLowerCase().trim(),
      name: user.name,
      role: user.role,
      image: user.image || (user.role === 'admin' ? "/dr-tamjid-hossain.jpg" : undefined)
    },
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  };
  sessions.push(newSession);
  saveStoredSessions(sessions);
  return newSession;
}

export function createOwnerSession(email: string = ADMIN_EMAIL, name: string = OWNER_NAME): StoredSession {
  return createUserSession({
    id: "owner-dr-tamjid",
    email,
    name,
    role: 'admin',
    image: "/dr-tamjid-hossain.jpg"
  });
}

// Verify session with LIVE MongoDB role check
export async function verifySessionToken(token: string): Promise<StoredSession | null> {
  if (!token) return null;
  const sessions = getStoredSessions();
  const session = sessions.find(s => s.token === token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    // expired
    return null;
  }

  // Live lookup from database so role changes in MongoDB take effect instantly
  try {
    const dbUser = await db.findUserByEmail(session.user.email);
    if (dbUser) {
      session.user.role = dbUser.role;
      session.user.name = dbUser.name;
    } else if (session.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      session.user.role = 'admin';
    }
  } catch (err) {
    // Fallback to cached session
  }

  return session;
}

export function deleteSessionToken(token: string) {
  const sessions = getStoredSessions().filter(s => s.token !== token);
  saveStoredSessions(sessions);
}

// Admin guard middleware
export async function requireAdminAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.bhh_session) {
    token = req.cookies.bhh_session;
  }

  if (!token) {
    res.status(401).json({ error: "অননুমোদিত প্রবেশাধিকার। লগইন করা প্রয়োজন।" });
    return;
  }

  const session = await verifySessionToken(token);
  if (!session || session.user.role !== 'admin') {
    res.status(403).json({ error: "শুধুমাত্র ক্লিনিক পরিচালক ডা. তামজীদ হোসেন (এডমিন)-এর জন্য সংরক্ষিত।" });
    return;
  }

  (req as any).user = session.user;
  next();
}
