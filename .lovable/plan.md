## SHIPWISE.ai Complete Overhaul

### Phase 1: Enable Backend & Auth
- Enable Lovable Cloud for auth + database
- Set up auth pages (login/signup) with protected routes

### Phase 2: Full UI Redesign — Premium AI Product Feel
- **Color palette**: Dark monochrome + emerald/teal accent (inspired by Linear/Vercel/Raycast — no blue/purple/gold)
- Update design tokens in index.css + tailwind.config.ts
- Redesign all pages: Landing, Dashboard, Pricing, Security

### Phase 3: UX Enhancements
1. Skeleton loaders (shimmer effect)
2. Micro-interactions (button feedback, hover states)
3. Page transition animations (framer-motion)
4. Progress indicators (loading bars, spinners)
5. Success/Error state animations
6. Empty state illustrations
7. AI Thinking animation (pulsing dots/wave)
8. Hover cards (PR details preview)
9. Notification animations (toast slide-in)
10. Scroll-triggered animations (intersection observer)

### Phase 4: PR Detail Page
- New route `/pr/:id` with risk breakdown, diff view, test suggestions

### Phase 5: Production Readiness
- README with all checklists (LAUNCH, PRODUCTION, EXECUTION, MVP_LAUNCH, READY, SAAS_READY)

### Color System (Emerald/Teal AI Theme)
- Background: `#09090B` (near-black)
- Card: `#18181B`
- Primary accent: `#10B981` (emerald)
- Muted: zinc tones
- Destructive: red, Success: emerald, Warning: amber
