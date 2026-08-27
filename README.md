# ☕ INDULGE YOURSELF | DP's Specialty Coffee & Refreshers (QR Digital Menu SPA)

Ultra-fast, mobile-first, zero-server QR Digital Menu Single Page Application (SPA) built with React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, and Framer Motion. Ready to deploy directly to **GitHub Pages**.

---

## 📱 Features

- ⚡ **Ultra-Fast & Mobile-First**: Optimized for 375px–430px smartphone viewports with instant loading and smooth 60fps animations.
- 📜 **100% Real Menu Data**: Exact pricing in Turkish Lira (₺), categorization (Espresso, Espresso Special, Filter Brews, Teas, Hot Chocolates, Ice Coffees, DP's Refreshers, Frozen, Milkshakes, Cocktails, Lemonades, and Extras) transcribed directly from actual cafe menu boards.
- 🌐 **Bilingual (TR / EN)**: Instant language switch between Turkish (Türkçe) and English.
- 💱 **Multi-Currency Support**: Real-time conversion toggle between ₺ TRY, $ USD, and € EUR.
- 🏷️ **Interactive Size & Extra Customization**: Bottom sheet drawer with Size Picker (Small, Medium, Large) and Add-on Extras (+Ekstra Süt, +Ekstra Aroma, +Ekstra Espresso Shot) with live total calculations.
- 🏷️ **Dynamic QR Table Support**: Reads table numbers dynamically from URL parameters (`?table=12` or `?masa=05`).
- 🛒 **Table Order Tray**: Guests can select and assemble their table order, then present the summary to their barista or waiter.
- 🔍 **Real-Time Live Search & Dietary Filters**: Search by item title, ingredients, or origin (Ethiopia, Guatemala, Colombia, Kenya AA) and filter by "🔥 Çok Satan", "🌶️ Chili Kick", "❄️ Cold Brew", and "☕ Kafeinsiz".
- 🚀 **GitHub Pages Zero-Config CI/CD**: Bundled with automated GitHub Actions workflow (`.github/workflows/deploy.yml`) and PWA manifest for mobile launcher support.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open in browser
# http://localhost:3000?table=07
```

---

## 📦 GitHub Pages Deployment

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: QR Digital Menu SPA"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### 2. Enable GitHub Pages in Repo Settings
1. Go to your GitHub repository: `Settings` → `Pages`.
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. The `.github/workflows/deploy.yml` will automatically build and publish your digital menu to:
   `https://<your-username>.github.io/<your-repo-name>/`

---

## 📋 QR Code URL Generation

You can generate QR codes for each table by encoding:
```
https://<your-username>.github.io/<your-repo-name>/?table=01
https://<your-username>.github.io/<your-repo-name>/?table=02
https://<your-username>.github.io/<your-repo-name>/?table=03
```
When scanned with any phone camera, the menu immediately opens tailored for that table!
