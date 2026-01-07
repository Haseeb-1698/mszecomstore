# Deployment Guide

Due to persistent Vercel cache issues with this project, use these commands instead of normal git workflow:

## 🚀 Standard Deployment (Use This Always)
```bash
npm run deploy
```

This command:
- Builds the project locally
- Forces cache invalidation
- Commits and pushes changes
- Guarantees fresh deployment

## 🔧 Alternative (If deploy fails)
```bash
npm run force-deploy
```

## ❌ Don't Use Normal Git Workflow
```bash
# DON'T USE - Cache issues
git add .
git commit -m "changes"
git push origin main
```

## Why This Happens
Vercel has persistent build cache issues with this Astro project. The custom deployment scripts ensure fresh builds every time by:
1. Adding unique timestamps
2. Building locally with fresh artifacts
3. Forcing Vercel to use new build output

## Quick Reference
- **Make changes** → `npm run deploy`
- **Changes not showing** → `npm run force-deploy`
- **Development** → `npm run dev`