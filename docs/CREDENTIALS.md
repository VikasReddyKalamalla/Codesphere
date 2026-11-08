# 🔑 CodeSphere Default Test Credentials

This document contains all default user credentials seeded into the CodeSphere database via `server/seed.js`.

---

## 🛡️ Admin Account
> **Access:** Platform Administration, User & Instructor Management, System Settings, Content Moderation, Analytics.

| Name | Role |Email | Username | Password | Plan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin User** | `admin` | `admin@codesphere.dev` | `adminuser` | `admin123` | Premium |

---

## 👨‍🏫 Instructor Accounts
> **Access:** Creating/Editing Learning Paths & Lessons, Hosting Live Sessions, Managing Assessments, Analytics.

| Name | Role | Email | Username | Password | Plan | Application Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Sarah Chen** | `instructor` | `instructor@gmail.com` | `sarahchen` | `instructor123` | Premium | Approved |
| **James Okafor** | `instructor` | `instructor2@gmail.com` | `jamesokafor` | `instructor123` | Premium | Approved |

---

## 🎓 Student Accounts
> **Access:** Enrolling in Paths, Taking Tests/Assessments, Workspace & Sandboxes, Community & Chat.

| Name | Role | Email | Username | Password | Plan | Streak / Points |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Vikas Reddy** | `student` | `vikas@example.com` | `vikasreddy` | `Password123!` | Standard | 7 days / 1240 pts |
| **Priya Nair** | `student` | `priya@example.com` | `priyanair` | `Password123!` | Standard | 5 days / 820 pts |
| **Alex Thompson** | `student` | `alex@example.com` | `alexthompson` | `Password123!` | Free | 2 days / 320 pts |

---

## 🛠️ How to Reset / Re-seed Database Credentials

If the database is reset or needs fresh seed data, run:

```bash
cd server
node seed.js
```
