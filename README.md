# 📚 ISBN Book Search App

A full-stack application that allows users to search for books using ISBN.  
The app integrates two data sources:

- **Google Books API** for quick lookups.
- **Custom Web Scraper (Playwright)** for scraping book data when API data is missing.

Frontend: **Next.js + React**  
Backend: **Django REST Framework**  
Scraping: **Playwright (headless Chromium)**

---

## 🚀 Features

- Search books by ISBN via Google Books API.
- Fallback scraping for unavailable ISBNs.
- Modern frontend with React hooks and reducer for state management.
- REST API with Django backend.
- Comprehensive unit tests for backend.
- Logger integration for observability.
- CI/CD with GitHub Actions.

---

## 🛠️ Tech Stack

**Frontend**

- Next.js (React, TypeScript)
- Tailwind CSS

**Backend**

- Django + Django REST Framework
- Playwright (for scraping)
- Pytest (with mocks)

**Infra**

- GitHub Actions (CI/CD)
- Railway / Vercel (deployment targets)

---

## 🤖 AI & Tooling Transparency

### AI Involvement

- **GPT-4.0, Claude 3.5 Sonnet** was used to:

  - Scaffold unit tests.
  - Generate commit messages and README drafts.

- AI served as a **pair programmer**, not an autonomous coder.

### Human Involvement

- All **business logic, architecture, and security-sensitive code** was written manually.
- AI-generated snippets were **reviewed, edited, and tested** before use.
- Debugging, deployments, and final design were handled by humans.
