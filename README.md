# Aura

A local-first, privacy-focused cycle tracking Progressive Web App (PWA).

![Version](https://img.shields.io/badge/version-1.0.9-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- 📅 **Calendar View** - Visual monthly calendar with flow indicators, predicted periods, and logged data
- 📊 **Weight Tracking** - Interactive chart with 30-day, 6-month, and 1-year views
- 📜 **History View** - Chronological list of all entries with quick editing
- ⚙️ **Customizable Settings** - Add custom moods, symptoms, and flow options
- 📱 **PWA Support** - Install on any device, works offline
- 🔒 **Privacy First** - All data stored locally, never sent to servers
- 📤 **Data Portability** - Export/import data as JSON

## Tech Stack

- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS 4** (PostCSS)
- **Chart.js** + **react-chartjs-2**
- **Lucide React** (icons)
- **date-fns** (date utilities)
- **vite-plugin-pwa** (offline support)

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/kolkenn/aura_react.git
cd aura_react

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command                  | Description                                                 |
| ------------------------ | ----------------------------------------------------------- |
| `npm run dev`            | Start development server                                    |
| `npm run build`          | Build for production                                        |
| `npm run preview`        | Preview production build                                    |
| `npm run lint`           | Run ESLint                                                  |
| `npm run type-check`     | Run TypeScript compiler check                               |
| `npm run check`          | Run type-check & lint                                       |
| `npm run bump <version>` | Bump version number in package.json, App.tsx, and README.md |
| `npm run lock`           | Lock dependencies and update package-lock.json              |

## Deployment

### GitHub Pages (Automatic)

Push to the `main` branch to trigger automatic deployment via GitHub Actions.

The app will be available at: `https://<username>.github.io/aura_react/`

### Manual Build

```bash
npm run build
# Output in ./dist folder
```

## Data Structure

All data is stored in `localStorage` under the key `cycle_tracker_mvp_data`:

```json
{
  "userSettings": {
    "averageCycleLength": 28,
    "flowOptions": ["None", "Spotting", "Light", "Medium", "Heavy"],
    "moodOptions": ["Happy", "Calm", "Anxious", "Sad", "Tired"],
    "symptomOptions": ["Cramps", "Headache", "Bloating", "Fatigue"]
  },
  "entries": {
    "2026-01-25": {
      "flow": "Light",
      "weight": "140.5",
      "mood": ["Happy", "Energetic"],
      "symptoms": ["Headache"]
    }
  }
}
```

## Import/Export

### Exporting Data

Settings → Export Data (JSON)

### Importing Data

Settings → Import Data (JSON)

**Supports both:**

- New format (this app's native format)
- Legacy format (from previous HTML version)

## Version Management

Use the bump script to update version across all files:

```bash
# Bump to specific version
npm run bump 1.1.0

# Or run directly
node scripts/bump-version.js 1.1.0
```

This updates:

- `package.json` → `version`
- `src/App.tsx` → `APP_VERSION`

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, BottomNav
│   ├── ui/              # Button, Card, Modal, Input, Chip, Toast
│   └── LogEntryModal.tsx
├── features/
│   ├── calendar/        # CalendarGrid, CalendarLogic
│   ├── weight/          # WeightChart, WeightStats
│   ├── history/         # HistoryList, HistoryItem
│   └── settings/        # ConfigForm, DataManagement
├── hooks/
│   ├── useLocalStorage.ts  # Data persistence
│   └── usePWAUpdate.ts     # PWA update notifications
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Tailwind + custom styles
```

## PWA Features

- **Offline Support** - Full functionality without internet
- **Installable** - Add to home screen on mobile/desktop
- **Update Notifications** - Toast when new version is available
- **Background Sync** - Periodic update checks

## License

MIT License - feel free to use and modify.

---

Made with 💜 for my wife.
