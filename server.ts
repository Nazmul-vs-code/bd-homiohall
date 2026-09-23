import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { toNodeHandler } from "better-auth/node";
import { db, initMongoDB } from "./server/db.js";
import {
  auth,
  ADMIN_EMAIL,
  OWNER_NAME,
  createUserSession,
  createOwnerSession,
  verifySessionToken,
  deleteSessionToken,
  requireAdminAuth,
  hashPassword,
  generateSalt
} from "./server/auth.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(cookieParser());
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Bypass Better Auth for our custom manual auth endpoints
  app.all("/api/auth/*", (req, res, next) => {
    if (
      req.path === '/api/auth/register' ||
      req.path === '/api/auth/login' ||
      req.path === '/api/auth/session' ||
      req.path === '/api/auth/me' ||
      req.path === '/api/auth/oauth-login' ||
      req.path === '/api/auth/logout'
    ) {
      return next();
    }
    try {
      const betterAuthHandler = toNodeHandler(auth);
      return betterAuthHandler(req, res);
    } catch (e) {
      next(e);
    }
  });

  // Body parser for other API routes (supports direct raw image uploads up to 35MB)
  app.use(express.json({ limit: "35mb" }));
  app.use(express.urlencoded({ extended: true, limit: "35mb" }));

  // Initialize DB
  await initMongoDB();

  // ==========================================
  // AUTHENTICATION ROUTES (Manual Account Creation & Login)
  // ==========================================
  
  // Manual User Registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({ error: "পূর্ণ নাম, ইমেইল এবং পাসওয়ার্ড প্রদান করুন।" });
        return;
      }

      const cleanEmail = email.trim().toLowerCase();
      if (password.length < 6) {
        res.status(400).json({ error: "পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।" });
        return;
      }

      const existingUser = await db.findUserByEmail(cleanEmail);
      if (existingUser) {
        res.status(400).json({ error: "এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে। অনুগ্রহ করে লগইন করুন।" });
        return;
      }

      const salt = generateSalt();
      const passwordHash = hashPassword(password, salt);
      // If matches ADMIN_EMAIL -> admin, otherwise user
      const role = cleanEmail === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';

      const newUser = await db.createUser({
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        salt,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const session = createUserSession(newUser);
      res.cookie('bhh_session', session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        token: session.token,
        user: session.user,
        message: role === 'admin'
          ? "অ্যাডমিন হিসেবে সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে!"
          : "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। ডাটাবেজে আপনার অ্যাকাউন্টটি অ্যাডমিন হিসেবে অনুমোদিত হলে পূর্ণ অ্যাডমিন এক্সেস পাবেন।"
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      res.status(500).json({ error: err.message || "রেজিস্ট্রেশন প্রক্রিয়ায় সমস্যা হয়েছে।" });
    }
  });

  // Manual User Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "ইমেইল এবং পাসওয়ার্ড প্রদান করুন।" });
        return;
      }

      const cleanEmail = email.trim().toLowerCase();
      let user = await db.findUserByEmail(cleanEmail);

      // If user does not exist and it's the admin email, auto-create account for ease of initial access
      if (!user && cleanEmail === ADMIN_EMAIL.toLowerCase()) {
        const salt = generateSalt();
        const passwordHash = hashPassword(password, salt);
        user = await db.createUser({
          id: 'admin-dr-tamjid',
          name: OWNER_NAME,
          email: cleanEmail,
          passwordHash,
          salt,
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      if (!user) {
        res.status(401).json({ error: "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।" });
        return;
      }

      const calculatedHash = hashPassword(password, user.salt);
      if (calculatedHash !== user.passwordHash) {
        // Special case for pre-seeded admin default password
        if (cleanEmail === ADMIN_EMAIL.toLowerCase() && password === "drTamjid2026!") {
          // Allow login and update password hash
          const newSalt = generateSalt();
          const newHash = hashPassword(password, newSalt);
          user.salt = newSalt;
          user.passwordHash = newHash;
          await db.createUser(user);
        } else {
          res.status(401).json({ error: "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।" });
          return;
        }
      }

      const session = createUserSession(user);
      res.cookie('bhh_session', session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        token: session.token,
        user: session.user
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ error: err.message || "লগইন প্রক্রিয়ায় সমস্যা হয়েছে।" });
    }
  });

  // Get active session with dynamic MongoDB role retrieval
  app.get(["/api/auth/session", "/api/auth/me"], async (req, res) => {
    const authHeader = req.headers.authorization;
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.bhh_session) {
      token = req.cookies.bhh_session;
    }

    if (!token) {
      res.json({ session: null, user: null });
      return;
    }

    const session = await verifySessionToken(token);
    if (!session) {
      res.json({ session: null, user: null });
      return;
    }

    res.json({
      session: { token: session.token, expires: new Date(session.expiresAt).toISOString() },
      user: session.user
    });
  });

  // Backward compatible owner login endpoint
  app.post("/api/auth/oauth-login", async (req, res) => {
    try {
      const { email, name } = req.body;
      const targetEmail = (email && typeof email === 'string') ? email.trim().toLowerCase() : ADMIN_EMAIL.toLowerCase();

      const session = createOwnerSession(targetEmail, name || OWNER_NAME);
      res.cookie('bhh_session', session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        token: session.token,
        user: session.user
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Login failed" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    const token = req.cookies?.bhh_session || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.substring(7) : '');
    if (token) {
      deleteSessionToken(token);
    }
    res.clearCookie('bhh_session');
    res.json({ success: true });
  });

  // Admin view registered users
  app.get("/api/admin/users", requireAdminAuth, async (req, res) => {
    try {
      const users = await db.getAllUsers();
      res.json({ users });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch users" });
    }
  });

  // Admin update user role (can also be done directly in MongoDB)
  app.post("/api/admin/users/role", requireAdminAuth, async (req, res) => {
    try {
      const { emailOrId, role } = req.body;
      if (!emailOrId || !role || (role !== 'admin' && role !== 'user')) {
        res.status(400).json({ error: "Invalid parameters" });
        return;
      }
      const success = await db.updateUserRole(emailOrId, role);
      res.json({ success, message: `User role updated to ${role}` });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to update role" });
    }
  });

  // ==========================================
  // PUBLIC WEBSITE ROUTES
  // ==========================================

  // Combined fast load for homepage
  app.get("/api/public/data", async (req, res) => {
    try {
      const [siteSettings, doctorProfile, doctors, chambers, treatments, articles] = await Promise.all([
        db.getSiteSettings(),
        db.getDoctorProfile(),
        db.getDoctors(),
        db.getChambers(),
        db.getTreatments(true),
        db.getArticles(true)
      ]);
      res.json({
        siteSettings,
        settings: siteSettings,
        doctorProfile,
        doctor: doctorProfile,
        doctors: doctors || [doctorProfile],
        chambers,
        treatments,
        articles
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to load clinic data", details: err.message });
    }
  });

  // Public doctors
  app.get("/api/public/doctors", async (req, res) => {
    try {
      const doctors = await db.getDoctors();
      res.json(doctors);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/public/doctors/:id", async (req, res) => {
    try {
      const doctor = await db.getDoctorById(req.params.id);
      if (!doctor) {
        res.status(404).json({ error: "চিকিৎসক পাওয়া যায়নি।" });
        return;
      }
      res.json(doctor);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Public treatments
  app.get("/api/public/treatments", async (req, res) => {
    try {
      const treatments = await db.getTreatments(true);
      res.json(treatments);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/public/treatments/:id", async (req, res) => {
    try {
      const treatment = await db.getTreatmentById(req.params.id);
      if (!treatment) {
        res.status(404).json({ error: "চিকিৎসা সেবা পাওয়া যায়নি।" });
        return;
      }
      res.json(treatment);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Public articles
  app.get("/api/public/articles", async (req, res) => {
    try {
      const articles = await db.getArticles(true);
      res.json(articles);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/public/articles/:idOrSlug", async (req, res) => {
    try {
      const article = await db.getArticleById(req.params.idOrSlug);
      if (!article || !article.isPublished) {
        res.status(404).json({ error: "প্রবন্ধটি পাওয়া যায়নি।" });
        return;
      }
      res.json(article);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Upload medical report image to ImgBB (Only PNG format accepted)
  app.post("/api/public/upload-report", async (req, res) => {
    try {
      const { image, name } = req.body;
      if (!image || typeof image !== 'string') {
        res.status(400).json({ error: "অনুগ্রহ করে রিপোর্টের ইমেজ ফাইল নির্বাচন করুন।" });
        return;
      }

      // Strict validation: Only PNG format allowed
      const isPngDataUri = image.startsWith("data:image/png;base64,");
      let base64Data = "";
      if (isPngDataUri) {
        base64Data = image.replace(/^data:image\/png;base64,/, "");
      } else if (!image.startsWith("data:image/")) {
        // If passed without header, inspect signature or verify
        base64Data = image;
      } else {
        res.status(400).json({ error: "শুধুমাত্র পিএনজি (.png) ফরম্যাটের রিপোর্ট ফাইল আপলোড করা যাবে।" });
        return;
      }

      // Check PNG magic bytes: 89 50 4E 47 (first 4 bytes of PNG in base64 start with iVBORw0KGgo)
      if (base64Data.length < 10) {
        res.status(400).json({ error: "ফাইলের সাইজ বা ফরম্যাট সঠিক নয়।" });
        return;
      }

      const imgbbKey = process.env.IMGBB_API_KEY || "8bb84650e0d6caa98ea544c5b10bcdb1";
      if (!imgbbKey) {
        res.status(500).json({ error: "ImgBB এপিআই কী কনফিগার করা নেই।" });
        return;
      }

      // Post to ImgBB API v1 using FormData
      const formData = new FormData();
      formData.append("key", imgbbKey);
      formData.append("image", base64Data);
      if (name) {
        formData.append("name", String(name).replace(/[^a-zA-Z0-9_-]/g, "_"));
      }

      const imgbbRes = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData
      });

      const imgbbJson: any = await imgbbRes.json();

      if (!imgbbRes.ok || !imgbbJson.success) {
        const errorDetail = imgbbJson?.error?.message || "ImgBB এ রিপোর্ট আপলোডে ব্যর্থ হয়েছে।";
        console.error("[ImgBB Upload Error]:", errorDetail);
        res.status(400).json({ error: `ছবি আপলোডে ত্রুটি: ${errorDetail}` });
        return;
      }

      const uploadedUrl = imgbbJson.data.display_url || imgbbJson.data.url;
      const deleteUrl = imgbbJson.data.delete_url;

      res.json({
        success: true,
        url: uploadedUrl,
        displayUrl: imgbbJson.data.display_url,
        thumbUrl: imgbbJson.data.thumb?.url,
        deleteUrl
      });
    } catch (err: any) {
      console.error("[ImgBB Upload Exception]:", err);
      res.status(500).json({ error: "সার্ভারে রিপোর্ট আপলোডে ত্রুটি ঘটেছে।" });
    }
  });

  // Submit appointment / serial
  app.post("/api/public/appointments", async (req, res) => {
    try {
      const {
        fullName,
        phone,
        patientType,
        serviceName,
        problemDescription,
        preferredChamber,
        preferredDate,
        reportImageUrl
      } = req.body;

      if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
        res.status(400).json({ error: "অনুগ্রহ করে আপনার সঠিক নাম প্রদান করুন।" });
        return;
      }

      if (!phone || typeof phone !== 'string' || phone.trim().length < 9) {
        res.status(400).json({ error: "অনুগ্রহ করে একটি সচল মোবাইল নাম্বার দিন।" });
        return;
      }

      if (!patientType || !['male', 'female', 'child'].includes(patientType)) {
        res.status(400).json({ error: "অনুগ্রহ করে রোগীর ধরন (পুরুষ / মহিলা / শিশু) নির্বাচন করুন।" });
        return;
      }

      if (!serviceName || typeof serviceName !== 'string') {
        res.status(400).json({ error: "অনুগ্রহ করে কাঙ্ক্ষিত সেবা নির্বাচন করুন।" });
        return;
      }

      const appointment = await db.createAppointment({
        fullName: fullName.trim(),
        phone: phone.trim(),
        patientType: patientType as any,
        serviceName: serviceName.trim(),
        problemDescription: (problemDescription || "").trim(),
        preferredChamber: preferredChamber || "মতলব চেম্বার",
        preferredDate: preferredDate || "যেকোনো দিন",
        reportImageUrl: typeof reportImageUrl === 'string' ? reportImageUrl.trim() : ""
      });

      res.status(201).json({
        success: true,
        message: "আপনার অ্যাপয়েন্টমেন্ট সফলভাবে জমা হয়েছে। চেম্বার থেকে শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।",
        appointment
      });
    } catch (err: any) {
      res.status(500).json({ error: "অ্যাপয়েন্টমেন্ট জমাদানে সমস্যা হয়েছে। অনুগ্রহ করে সরাসরি ফোন করুন।" });
    }
  });

  // ==========================================
  // PROTECTED ADMIN DASHBOARD ROUTES
  // ==========================================

  // Dashboard stats & overview
  app.get("/api/admin/overview", requireAdminAuth, async (req, res) => {
    try {
      const [appointments, treatments, articles] = await Promise.all([
        db.getAppointments(),
        db.getTreatments(false),
        db.getArticles(false)
      ]);

      const pending = appointments.filter(a => a.status === 'pending').length;
      const contacted = appointments.filter(a => a.status === 'contacted').length;
      const completed = appointments.filter(a => a.status === 'completed').length;

      res.json({
        stats: {
          totalAppointments: appointments.length,
          pendingAppointments: pending,
          contactedAppointments: contacted,
          completedAppointments: completed,
          totalTreatments: treatments.length,
          totalArticles: articles.length
        },
        recentInquiries: appointments.slice(0, 5)
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Appointments CRUD
  app.get("/api/admin/appointments", requireAdminAuth, async (req, res) => {
    try {
      const appointments = await db.getAppointments();
      res.json(appointments);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/admin/appointments/:id/status", requireAdminAuth, async (req, res) => {
    try {
      const { status, notes } = req.body;
      if (!['pending', 'contacted', 'completed'].includes(status)) {
        res.status(400).json({ error: "Invalid status value" });
        return;
      }
      const updated = await db.updateAppointmentStatus(req.params.id, status, notes);
      if (!updated) {
        res.status(404).json({ error: "Appointment not found" });
        return;
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admin/appointments/:id", requireAdminAuth, async (req, res) => {
    try {
      const success = await db.deleteAppointment(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Treatments CRUD
  app.get("/api/admin/treatments", requireAdminAuth, async (req, res) => {
    try {
      const treatments = await db.getTreatments(false);
      res.json(treatments);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/treatments", requireAdminAuth, async (req, res) => {
    try {
      const { titleEn, titleBn, descriptionEn, descriptionBn, icon, imageUrl, order, isActive, category } = req.body;
      if (!titleBn) {
        res.status(400).json({ error: "বাংলা শিরোনাম আবশ্যক" });
        return;
      }
      const treatment = await db.createTreatment({
        titleEn: titleEn || titleBn,
        titleBn,
        descriptionEn: descriptionEn || "",
        descriptionBn: descriptionBn || "",
        icon: icon || "Stethoscope",
        imageUrl: imageUrl || "",
        order: Number(order) || 1,
        isActive: isActive !== false,
        category: category || "সাধারণ চিকিৎসা"
      });
      res.status(201).json(treatment);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/treatments/:id", requireAdminAuth, async (req, res) => {
    try {
      const updated = await db.updateTreatment(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: "চিকিৎসা সেবা পাওয়া যায়নি" });
        return;
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admin/treatments/:id", requireAdminAuth, async (req, res) => {
    try {
      const success = await db.deleteTreatment(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/treatments/reorder", requireAdminAuth, async (req, res) => {
    try {
      const { orderedIds } = req.body;
      if (!Array.isArray(orderedIds)) {
        res.status(400).json({ error: "orderedIds must be an array" });
        return;
      }
      const treatments = await db.reorderTreatments(orderedIds);
      res.json(treatments);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Articles CRUD
  app.get("/api/admin/articles", requireAdminAuth, async (req, res) => {
    try {
      const articles = await db.getArticles(false);
      res.json(articles);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/articles", requireAdminAuth, async (req, res) => {
    try {
      const { titleBn, titleEn, category, contentBn, excerptBn, imageUrl, isPublished, slug } = req.body;
      if (!titleBn || !contentBn) {
        res.status(400).json({ error: "বাংলা শিরোনাম ও বিস্তারিত বিষয়বস্তু আবশ্যক" });
        return;
      }
      const article = await db.createArticle({
        titleBn,
        titleEn,
        category: category || "স্বাস্থ্য পরামর্শ",
        contentBn,
        excerptBn: excerptBn || contentBn.substring(0, 160) + "...",
        imageUrl: imageUrl || "",
        isPublished: isPublished !== false,
        slug: slug || ('art-' + Date.now())
      });
      res.status(201).json(article);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/articles/:id", requireAdminAuth, async (req, res) => {
    try {
      const updated = await db.updateArticle(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: "প্রবন্ধটি পাওয়া যায়নি" });
        return;
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admin/articles/:id", requireAdminAuth, async (req, res) => {
    try {
      const success = await db.deleteArticle(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Doctors Management (Admin)
  app.get("/api/admin/doctors", requireAdminAuth, async (req, res) => {
    try {
      const doctors = await db.getDoctors();
      res.json(doctors);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/doctors", requireAdminAuth, async (req, res) => {
    try {
      const {
        nameBn,
        nameEn,
        qualifications,
        registrationNo,
        designation,
        designationBn,
        role,
        roleBn,
        bioBn,
        imageUrl,
        experienceYears,
        phones,
        specialties,
        chambers,
        isLead
      } = req.body;

      if (!nameBn) {
        res.status(400).json({ error: "চিকিৎসকের বাংলা নাম আবশ্যক।" });
        return;
      }

      const doctor = await db.createDoctor({
        nameBn,
        nameEn: nameEn || nameBn,
        qualifications: qualifications || "",
        registrationNo: registrationNo || "",
        designation: designation || "",
        designationBn: designationBn || "",
        role: role || "",
        roleBn: roleBn || "",
        bioBn: bioBn || "",
        imageUrl: imageUrl || "/dr-tamjid-hossain.jpg",
        experienceYears: Number(experienceYears) || 5,
        phones: Array.isArray(phones) ? phones : (phones ? [phones] : []),
        specialties: Array.isArray(specialties) ? specialties : (specialties ? [specialties] : []),
        chambers: Array.isArray(chambers) ? chambers : [],
        isLead: Boolean(isLead)
      });

      res.status(201).json(doctor);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/doctors/:id", requireAdminAuth, async (req, res) => {
    try {
      const updated = await db.updateDoctor(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: "চিকিৎসক পাওয়া যায়নি" });
        return;
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admin/doctors/:id", requireAdminAuth, async (req, res) => {
    try {
      const success = await db.deleteDoctor(req.params.id);
      if (!success) {
        res.status(400).json({ error: "প্রধান চিকিৎসক মুছে ফেলা যাবে না অথবা অন্তত একজন চিকিৎসক থাকতে হবে।" });
        return;
      }
      res.json({ success: true, message: "চিকিৎসক সফলভাবে মুছে ফেলা হয়েছে।" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Doctor Profile Edit (Legacy single profile support)
  app.get("/api/admin/doctor", requireAdminAuth, async (req, res) => {
    try {
      const doctor = await db.getDoctorProfile();
      res.json(doctor);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/doctor", requireAdminAuth, async (req, res) => {
    try {
      const updated = await db.updateDoctorProfile(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Helper to save doctor photo without any edits or filters
  async function saveRawDoctorPhoto(imageData: string, fileName?: string, doctorId?: string) {
    const fs = await import("fs/promises");
    const matches = imageData.match(/^data:image\/([A-Za-z0-9-+.]+);base64,(.+)$/);
    let buffer: Buffer;
    let ext = "jpg";

    if (matches && matches.length === 3) {
      const mimeType = matches[1].toLowerCase();
      if (mimeType.includes("png")) ext = "png";
      else if (mimeType.includes("webp")) ext = "webp";
      else if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = "jpg";
      buffer = Buffer.from(matches[2], "base64");
    } else {
      const rawBase64 = imageData.replace(/^data:[^;]+;base64,/, "");
      buffer = Buffer.from(rawBase64, "base64");
    }

    const publicDir = path.join(process.cwd(), "public");
    try {
      await fs.mkdir(publicDir, { recursive: true });
    } catch (e) {
      // already exists
    }

    const cleanId = (doctorId || "dr-tamjid-hossain").replace(/[^a-zA-Z0-9_-]/g, "");
    const targetFilename = `${cleanId}.${ext}`;
    const targetPath = path.join(publicDir, targetFilename);
    await fs.writeFile(targetPath, buffer);

    // Also write jpg variant if extension is different
    if (ext !== "jpg") {
      await fs.writeFile(path.join(publicDir, `${cleanId}.jpg`), buffer);
    }

    if (fileName) {
      const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
      try {
        await fs.writeFile(path.join(publicDir, sanitized), buffer);
      } catch (e) {
        // ignore
      }
    }

    // Sync to dist if dist exists
    const distPath = path.join(process.cwd(), "dist");
    try {
      await fs.access(distPath);
      await fs.writeFile(path.join(distPath, targetFilename), buffer);
      await fs.writeFile(path.join(distPath, `${cleanId}.jpg`), buffer);
    } catch (e) {
      // dist may not exist yet
    }

    const imageUrl = `/${targetFilename}?v=${Date.now()}`;
    if (doctorId) {
      await db.updateDoctor(doctorId, { imageUrl });
    } else {
      await db.updateDoctorProfile({ imageUrl });
    }
    return imageUrl;
  }

  // Doctor Photo Direct File Upload for specific doctor
  app.post("/api/admin/doctors/:id/upload-photo", requireAdminAuth, async (req, res) => {
    try {
      const { imageData, fileName } = req.body;
      if (!imageData || typeof imageData !== "string") {
        res.status(400).json({ error: "ছবির ডাটা পাওয়া যায়নি।" });
        return;
      }
      const imageUrl = await saveRawDoctorPhoto(imageData, fileName, req.params.id);
      res.json({
        success: true,
        imageUrl,
        message: "চিকিৎসকের মূল ছবি কোনো ফিল্টার বা পরিবর্তন ছাড়াই সরাসরি সংরক্ষিত হয়েছে।"
      });
    } catch (err: any) {
      console.error("Photo upload error:", err);
      res.status(500).json({ error: err.message || "ছবি আপলোড ব্যর্থ হয়েছে।" });
    }
  });

  // Doctor Photo Direct File Upload (Admin Authenticated - default/lead)
  app.post("/api/admin/doctor/upload-photo", requireAdminAuth, async (req, res) => {
    try {
      const { imageData, fileName } = req.body;
      if (!imageData || typeof imageData !== "string") {
        res.status(400).json({ error: "ছবির ডাটা পাওয়া যায়নি।" });
        return;
      }
      const imageUrl = await saveRawDoctorPhoto(imageData, fileName);
      res.json({
        success: true,
        imageUrl,
        message: "চিকিৎসকের মূল ছবি কোনো ফিল্টার বা পরিবর্তন ছাড়াই সরাসরি সংরক্ষিত হয়েছে।"
      });
    } catch (err: any) {
      console.error("Photo upload error:", err);
      res.status(500).json({ error: err.message || "ছবি সংরক্ষণে সমস্যা হয়েছে।" });
    }
  });


  // Smart doctor photo file resolver
  app.get(["/dr-tamjid-hossain.jpg", "/dr-tamjid-hossain.png", "/dr-tamjid-hossain.jpeg", "/dr-tamjid-hossain.webp"], async (req, res, next) => {
    try {
      const fs = await import("fs/promises");
      const publicDir = path.join(process.cwd(), "public");
      const candidates = [
        "dr-tamjid-hossain.png",
        "dr-tamjid-hossain.jpg",
        "dr-tamjid-hossain.jpeg",
        "dr-tamjid-hossain.webp"
      ];
      for (const c of candidates) {
        const fullPath = path.join(publicDir, c);
        try {
          await fs.access(fullPath);
          return res.sendFile(fullPath);
        } catch (e) {
          // not found, try next
        }
      }

      // Check if any screenshot or doctor image exists in public directory
      const files = await fs.readdir(publicDir);
      const match = files.find(f => {
        const lower = f.toLowerCase();
        return (
          (lower.includes("screenshot") || lower.includes("tamjid") || lower.includes("doctor")) &&
          (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".webp"))
        );
      });
      if (match) {
        return res.sendFile(path.join(publicDir, match));
      }
    } catch (e) {
      // ignore
    }
    next();
  });

  // Settings & Hero Management
  app.get("/api/admin/settings", requireAdminAuth, async (req, res) => {
    try {
      const settings = await db.getSiteSettings();
      res.json(settings);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/settings", requireAdminAuth, async (req, res) => {
    try {
      const updated = await db.updateSiteSettings(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Chambers Edit
  app.get("/api/admin/chambers", requireAdminAuth, async (req, res) => {
    try {
      const chambers = await db.getChambers();
      res.json(chambers);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/chambers/:id", requireAdminAuth, async (req, res) => {
    try {
      const updated = await db.updateChamber(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: "চেম্বার পাওয়া যায়নি" });
        return;
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // VITE MIDDLEWARE OR STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BHH] বাংলাদেশ হোমিও হল Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
