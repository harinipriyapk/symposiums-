// server.js  –  Node.js + Express + Nodemailer
// Install: npm install express nodemailer cors dotenv

import express, { json } from "express";
import { createTransport } from "nodemailer";
import cors from "cors";
require("dotenv").config();

const app = express();
app.use(json());
app.use(cors({ origin: "http://localhost:5173" })); // Vite default port

/* ── Gmail Transporter ───────────────────────────────────────────── */
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,   // your Gmail address
    pass: process.env.GMAIL_PASS,   // Gmail App Password (NOT your real password)
  },
});

/* ── Verify transporter on startup ──────────────────────────────── */
transporter.verify((err) => {
  if (err) console.error("Mail transporter error:", err.message);
  else     console.log("Mail server ready");
});

/* ── Build student confirmation HTML ─────────────────────────────── */
const buildStudentEmail = (d) => `
<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<style>
  body{margin:0;padding:0;background:#020810;font-family:'Segoe UI',sans-serif;color:#f1f5f9}
  .wrap{max-width:580px;margin:40px auto;background:#070f1e;border-radius:16px;border:1px solid rgba(0,245,196,.2);overflow:hidden}
  .hdr{background:linear-gradient(135deg,#020810,#0c1a30);padding:36px 36px 24px;text-align:center;border-bottom:2px solid #00f5c4}
  .hdr h1{font-size:20px;letter-spacing:3px;text-transform:uppercase;color:#00f5c4;margin:0 0 6px}
  .hdr p{font-size:11px;color:#94a3b8;letter-spacing:2px;text-transform:uppercase;margin:0}
  .body{padding:32px 36px}
  .greeting{font-size:18px;font-weight:600;margin-bottom:8px}
  .sub{font-size:14px;color:#94a3b8;margin-bottom:28px;line-height:1.6}
  .badge{display:inline-block;background:#00f5c4;color:#020810;padding:5px 16px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px;margin-bottom:20px}
  .card{background:rgba(0,245,196,.05);border:1px solid rgba(0,245,196,.15);border-radius:10px;padding:20px 24px;margin-bottom:24px}
  .row{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:13px}
  .row:last-child{border-bottom:none}
  .k{color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700}
  .v{color:#f1f5f9;font-weight:600;text-align:right}
  .note{font-size:13px;color:#94a3b8;line-height:1.7}
  .foot{padding:20px 36px 28px;text-align:center}
  .foot p{font-size:11px;color:#475569;letter-spacing:.5px}
  .accent{color:#00f5c4}
</style></head><body>
<div class="wrap">
  <div class="hdr">
    <h1>Adithya Institute of Technology</h1>
    <p>Symposium 2025 &nbsp;&middot;&nbsp; March 12&ndash;13</p>
  </div>
  <div class="body">
    <p class="greeting">Hi ${d.name} 👋</p>
    <p class="sub">Your registration is <strong class="accent">confirmed</strong>!
    We're thrilled to have you at Symposium 2025. Here's a summary of your registration:</p>
    <span class="badge">✦ Registration Confirmed</span>
    <div class="card">
      <div class="row"><span class="k">Event</span>      <span class="v">${d.event}</span></div>
      <div class="row"><span class="k">Name</span>       <span class="v">${d.name}</span></div>
      <div class="row"><span class="k">Email</span>      <span class="v">${d.email}</span></div>
      <div class="row"><span class="k">Phone</span>      <span class="v">${d.phone}</span></div>
      <div class="row"><span class="k">College</span>    <span class="v">${d.college}</span></div>
      <div class="row"><span class="k">Department</span> <span class="v">${d.department}</span></div>
      <div class="row"><span class="k">Year</span>       <span class="v">${d.year}</span></div>
      ${d.teamName ? `<div class="row"><span class="k">Team</span><span class="v">${d.teamName} (${d.teamSize} members)</span></div>` : ""}
    </div>
    <p class="note">Please arrive <strong style="color:#f1f5f9">30 minutes early</strong>
    with this email and a valid college ID for verification at the venue.</p>
  </div>
  <div class="foot">
    <p>&copy; 2025 Adithya Institute of Technology &nbsp;&middot;&nbsp; Symposium Team</p>
    <p style="margin-top:6px">Questions? <span class="accent">symposium@ait.edu</span></p>
  </div>
</div>
</body></html>`;

/* ── Build admin notification HTML ───────────────────────────────── */
const buildAdminEmail = (d) => `
<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<style>
  body{margin:0;padding:0;background:#020810;font-family:'Segoe UI',sans-serif;color:#f1f5f9}
  .wrap{max-width:520px;margin:40px auto;background:#070f1e;border-radius:14px;border:1px solid rgba(249,115,22,.25);overflow:hidden}
  .hdr{background:linear-gradient(135deg,#020810,#1a0c05);padding:26px 30px 18px;border-bottom:2px solid #f97316}
  .hdr h1{font-size:15px;letter-spacing:2px;text-transform:uppercase;color:#f97316;margin:0 0 4px}
  .hdr p{font-size:11px;color:#94a3b8;margin:0}
  .body{padding:26px 30px}
  .title{font-size:15px;font-weight:700;margin-bottom:16px}
  .card{background:rgba(249,115,22,.04);border:1px solid rgba(249,115,22,.15);border-radius:10px;padding:18px 20px}
  .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:13px}
  .row:last-child{border-bottom:none}
  .k{color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700}
  .v{color:#f1f5f9;font-weight:600;text-align:right;max-width:65%}
  .ts{font-size:11px;color:#475569;padding:14px 30px;text-align:right}
</style></head><body>
<div class="wrap">
  <div class="hdr">
    <h1>🔔 New Registration Alert</h1>
    <p>Symposium 2025 — Admin Panel</p>
  </div>
  <div class="body">
    <p class="title">A new participant has registered:</p>
    <div class="card">
      <div class="row"><span class="k">Name</span>       <span class="v">${d.name}</span></div>
      <div class="row"><span class="k">Email</span>      <span class="v">${d.email}</span></div>
      <div class="row"><span class="k">Phone</span>      <span class="v">${d.phone}</span></div>
      <div class="row"><span class="k">College</span>    <span class="v">${d.college}</span></div>
      <div class="row"><span class="k">Department</span> <span class="v">${d.department}</span></div>
      <div class="row"><span class="k">Year</span>       <span class="v">${d.year}</span></div>
      <div class="row"><span class="k">Event</span>      <span class="v">${d.event}</span></div>
      ${d.teamName ? `<div class="row"><span class="k">Team</span><span class="v">${d.teamName} (${d.teamSize} members)</span></div>` : ""}
      ${d.experience ? `<div class="row"><span class="k">Experience</span><span class="v">${d.experience.slice(0, 80)}${d.experience.length > 80 ? "…" : ""}</span></div>` : ""}
    </div>
  </div>
  <p class="ts">Received: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
</div>
</body></html>`;

/* ── POST /api/register ──────────────────────────────────────────── */
app.post("/api/register", async (req, res) => {
  const data = req.body;

  // Server-side guard
  if (!data.name || !data.email || !data.phone || !data.event) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  try {
    // 1. Confirmation → student
    await transporter.sendMail({
      from:    `"Symposium 2025 – AIT" <${process.env.GMAIL_USER}>`,
      to:      data.email,
      subject: `Registration Confirmed – ${data.event} | Symposium 2025`,
      html:    buildStudentEmail(data),
    });

    // 2. Notification → admin
    await transporter.sendMail({
      from:    `"Symposium Bot" <${process.env.GMAIL_USER}>`,
      to:      process.env.ADMIN_EMAIL,
      subject: `New Registration: ${data.name} – ${data.event}`,
      html:    buildAdminEmail(data),
    });

    console.log(`Emails sent → student: ${data.email} | admin: ${process.env.ADMIN_EMAIL}`);
    res.json({ success: true, message: "Emails sent successfully." });

  } catch (err) {
    console.error("Email error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send email. Please try again." });
  }
});

/* ── Health check ────────────────────────────────────────────────── */
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

/* ── Start ───────────────────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running → http://localhost:${PORT}`)
);
