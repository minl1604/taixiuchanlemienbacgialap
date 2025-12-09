# Tài Xỉu Miền Bắc Giả Lập

[cloudflarebutton]

## Overview

**Tài Xỉu Miền Bắc Giả Lập** is a fully client-side web application that simulates the "Giải Đặc Biệt" (Special Prize) of Northern Vietnam Lottery (Xổ Số Miền Bắc) for entertainment purposes only. This fake simulator generates random 5-digit numbers (00000–99999) entirely on the client, calculates the sum of digits to determine "Tài" (Over) or "Xỉu" (Under), and "Chẵn" (Even) or "Lẻ" (Odd) outcomes. Users can make predictions before each round, track history, view trends, and monitor fun stats—all stored in localStorage. No real lottery data, betting, or money is involved; it's purely for fun.

The app features a 45-second auto-round timer, manual controls, and a retro neon dark theme. All user-facing text is in Vietnamese.

## Key Features

- **Random Round Generation**: Simulates 5-digit lottery numbers with digit sum calculations for Tài/Xỉu (sum ≥23 = Tài, <23 = Xỉu) and Chẵn/Lẻ (even/odd sum).
- **Auto and Manual Rounds**: Automatic generation every 45 seconds with a countdown timer; options to start/stop auto mode or generate instantly.
- **User Predictions**: Select Tài/Xỉu and/or Chẵn/Lẻ before each round; tracks correct/incorrect guesses, accuracy percentage, longest streak, and "fun points" (no real currency).
- **History Management**: Stores up to 100 recent rounds in localStorage, displaying numbers, sums, outcomes, timestamps, and prediction results.
- **Trend Visualization**: Dot-grid charts for Tài/Xỉu (red/blue) and Chẵn/Lẻ trends with hover details.
- **Stats Dashboard**: Shows total rounds, correct/wrong counts, accuracy, streaks, and reset options.
- **Settings**: Toggle auto-start on load, sound effects (optional), and history limits.
- **Responsive UI**: Mobile-first design with dark theme, neon gradients, and smooth micro-interactions.
- **Offline-Capable**: Fully client-side with no backend dependencies; easy to extend for Cloudflare Workers if needed.

## Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and bundling
- **Styling**: Tailwind CSS v3 + shadcn/ui components for accessible, customizable UI
- **State Management**: Zustand for lightweight, performant state handling
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Icons**: Lucide React for scalable vector icons
- **Notifications**: Sonner for toast feedback
- **Charts**: Recharts (optional) or custom CSS grids for trends
- **Routing**: React Router DOM
- **Utilities**: clsx, tailwind-merge, UUID for IDs, date-fns for timestamps
- **Deployment**: Cloudflare Pages (static) + Workers (optional serverless backend)
- **Other**: Immer for immutable updates, React Hook Form for forms (if extended)

## Installation

This project uses Bun as the package manager for faster installs and development. Ensure Bun is installed on your system (download from [bun.sh](https://bun.sh)).

1. Clone the repository:
   ```
   git clone <repository-url>
   cd tai-xiu-mien-bac-gia-lap
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. (Optional) Set up Cloudflare Wrangler for Workers integration:
   ```
   bun add -D wrangler
   wrangler login
   ```

## Usage

Run the development server:

```
bun dev
```

The app will be available at `http://localhost:3000` (or the port specified by `${PORT:-3000}`). Open in a browser to start simulating rounds.

- **Auto Mode**: Click "Bắt đầu auto" to start the 45-second timer cycle.
- **Manual Generation**: Use "Quay ngay 1 kỳ" to generate a round instantly.
- **Predictions**: Select options in "Dự đoán kỳ này" before the timer ends.
- **Views**: Navigate to "Xu hướng" for trends, "Kết quả gần đây" for history, and "Thống kê" for stats.
- **Persistence**: All data saves to localStorage automatically; clears on incognito or storage reset.

For production builds:
```
bun run build
```
Output is in the `dist/` folder, ready for deployment.

## Development

- **Linting**: Run `bun lint` to check code quality. Fix issues with your editor or `bun lint --fix`.
- **TypeScript**: Strict mode enabled; use `bun tsc --noEmit` for type checking.
- **Hot Reload**: Vite provides instant updates during `bun dev`.
- **Adding Features**: Extend stores in `src/stores/` (e.g., historyStore, statsStore). Use shadcn/ui components for new UI elements. Follow the blueprint for data flow (simulator in `src/lib/simulator.ts`).
- **Testing**: Unit tests can be added with Vitest (not included); focus on component isolation for predictions and timer logic.
- **Customization**: Edit `tailwind.config.js` for colors (#F38020 orange, #4FACFE blue, #F5576C pink). All Vietnamese text is in components.

Common development workflow:
1. Start dev server: `bun dev`
2. Make changes to components/stores.
3. Test predictions and auto-timer.
4. Build and preview: `bun preview`

## Deployment

Deploy to Cloudflare Pages for static hosting (recommended for v1) or Workers for dynamic features.

### Cloudflare Pages (Static SPA)
1. Install Wrangler CLI: `bun add -D wrangler`
2. Login: `wrangler login`
3. Publish:
   ```
   wrangler pages publish dist --project-name=tai-xiu-mien-bac-gia-lap
   ```
   Or push to GitHub and connect via Cloudflare Dashboard > Pages > Connect to Git.

The app is fully static and offline-capable after build.

### Cloudflare Workers (Optional Backend)
For future Worker integration (e.g., authoritative simulation):
1. Configure routes in `worker/userRoutes.ts`.
2. Deploy: `wrangler deploy`
3. Assets route through Pages integration.

[cloudflarebutton]

## Contributing

Contributions are welcome! Please:
- Fork the repo and create a feature branch.
- Follow TypeScript and ESLint rules.
- Add tests for new logic (simulator, stats).
- Update Vietnamese translations if adding text.
- Submit PRs with clear descriptions.

## License

This project is MIT licensed. See the blueprint for usage notes: strictly for entertainment; no real gambling.