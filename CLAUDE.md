# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` - Runs on http://localhost:8080
- **Build for production**: `npm run build` - Creates optimized build in `dist/`
- **Build for development**: `npm run build:dev` - Creates development build
- **Lint code**: `npm run lint` - Runs ESLint
- **Preview production build**: `npm run preview` - Preview built site

## Architecture Overview

This is a React-based healthcare dashboard for monitoring sepsis risk in patients. The application uses:

- **React 18** with TypeScript for type safety
- **Vite** as the build tool with SWC for fast compilation
- **shadcn/ui** components built on Radix UI primitives
- **Tailwind CSS** for styling with CSS variables for theming
- **React Router** for client-side routing
- **Recharts** for data visualization
- **React Query** (TanStack Query) for server state management
- **React Hook Form** with Zod for form handling and validation

### Key Directories

- `/src/components/` - React components including Dashboard, PatientCard, and various UI elements
- `/src/components/ui/` - Reusable shadcn/ui components (40+ components)
- `/src/pages/` - Page components (Index, NotFound)
- `/src/services/` - Data services including riskDataService.ts
- `/src/types/` - TypeScript type definitions
- `/src/hooks/` - Custom React hooks
- `/src/lib/` - Utility functions

### Important Configuration

- **Path aliases**: `@/` maps to `./src/` directory
- **Base path**: Set to `/sepsis-dashboard/` for GitHub Pages deployment
- **Port**: Development server runs on port 8080
- **Theme**: Dark/light mode support via next-themes
- **Deployment**: GitHub Actions automatically deploys to GitHub Pages on push to main

### Key Implementation Details

1. The dashboard displays patient information with sepsis risk indicators
2. Uses responsive design patterns for mobile and desktop views
3. Implements a slide-in patient detail panel using Sheet component
4. Charts display risk factors by department using Recharts
5. Real-time data simulation through riskDataService.ts

### Testing

Currently, no testing framework is configured. When implementing tests, consider adding Jest and React Testing Library.

### GitHub Pages Deployment

The project is configured for GitHub Pages deployment with:
- Custom 404.html for client-side routing support
- Base path configuration in vite.config.ts
- Automated deployment via GitHub Actions on push to main branch