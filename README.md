# basket-mix (Template Mashup HD)

Base template for building Qlik Sense mashups (embedded analytics applications) at **Cluster Design**.

This template codifies the standard architecture used across all Cluster mashup projects. It provides a consistent starting point with configuration-driven pages, multi-environment Qlik connectivity, multi-language support, responsive layouts, and Kubernetes-ready deployment.

---

## Features

- **Dual Qlik connectivity** -- supports both Qlik Cloud Services (QCS) via Web Integration ID and Qlik Sense Enterprise (QSE) via ticket/auth
- **Configuration-driven pages** -- dashboards and detail pages are defined in JSON files under `public/config/PagesConfig/`. Adding a visualization means editing JSON, not React code
- **Multi-language i18n** -- Portuguese (pt_BR), English (en_US), and Spanish (es_ES) loaded dynamically. Defaults to Brazilian Portuguese
- **Responsive layouts** -- separate Desktop and Mobile component trees per page, with carousel-based navigation on mobile
- **Qlik bookmark management** -- create, edit, and apply bookmarks through the UI
- **Filter synchronization** -- Qlik selections propagate to UI components (FilterMenu, CurrentSelections) and vice versa
- **KPI cards, charts, and custom tables** -- pre-built components for Bar, Line, Venn, WaterFall charts plus custom filterable tables
- **Auth with JWT session management** -- login page with API authentication, token refresh via MiddlewareRoute guard, SSO logout redirect
- **Docker + Kubernetes deployment** -- multi-stage Docker build, nginx unprivileged runtime, K8s manifests for develop/homol/master environments
- **CI/CD via Bitbucket Pipelines** -- 5-step pipeline: setup, Docker lint, K8s lint, build, deploy

---

## Tech Stack

| Category | Technologies |
|----------|-------------|
| Framework | React 17, React Router 5 (HashRouter), Redux 4 |
| Language | TypeScript 4.8 (partial adoption), JavaScript (JSX) |
| Styling | SCSS (7-1 pattern), styled-components 5, MUI 5 |
| Charts | ECharts 4, D3 7, venn.js |
| i18n | i18next 22 |
| HTTP | Axios |
| Build | CRA 5 (react-scripts), react-app-rewired, Webpack 5 |
| Linting | Prettier, stylelint (config-sass-guidelines) |
| Runtime | Node.js 16.x |
| Deployment | Docker (multi-stage), nginx, Kubernetes, APISIX Ingress |

---

## Getting Started

### Prerequisites

- Node.js 16.x
- Yarn (preferred) or npm

### Setup

```bash
cp .env.example .env   # if available
yarn install
```

### Environment Variables

Create a `.env` file or configure these in your CI/CD pipeline:

| Variable | Purpose |
|----------|---------|
| `REACT_APP_HOST` | Qlik server hostname |
| `REACT_APP_PREFIX` | URL prefix for Qlik resources |
| `REACT_APP_PORT` | Qlik server port (443 or 4848) |
| `REACT_APP_IS_SECURE` | Use HTTPS (`true`/`false`) |
| `REACT_APP_QVF_ID` | Qlik app (.qvf) ID to open |
| `REACT_APP_WEB_INTEGRATION_ID` | QCS Web Integration ID (required for QCS) |

### Available Scripts

```bash
yarn start            # Development server at http://localhost:3000
yarn start-https      # HTTPS mode (required for Qlik integration in some setups)
yarn build            # Production build to build/
```

---

## Project Structure

```
src/
  App.jsx               # Root component, context providers
  index.jsx             # Entry point (Redux Provider wrapping App)
  QlikEngine.jsx        # Qlik connection module (QCS/QSE)
  QlikUtils.jsx         # Qlik object utility functions
  i18n.js               # i18next configuration
  style.scss            # Global styles (SCSS 7-1 pattern)
  context/              # React Context providers (9 providers)
    QlikProvider        # Qlik engine instance / app connection
    SelectionsProvider  # Qlik selection state sync
    BookMarkProvider    # Bookmark CRUD
    ConfigProvider      # Aggregated page configurations
    FiltersProvider     # Filter state management
    ModalProvider       # Modal visibility
    FilterBarProvider   # Filter bar open/close
    LeftBarProvider     # Left sidebar open/close
    ExportIdProvider    # Export ID tracking
  store/                # Redux store (session, user, manufacturer filters)
  components/           # ~40 reusable UI components
  pages/                # Page-level components
    Layout.jsx          # Main layout with routing, header, menus
    Dashboard/          # Dashboard page (Desktop + Mobile)
    Detail/             # Detail page (Desktop + Mobile)
    auth/               # Login, Logout (SSO)
    404/                # Not found
public/
  config/               # JSON page configurations
  locales/              # i18n translations (pt_BR, en_US, es_ES)
  favicon/              # Favicon assets
k8s/                    # Kubernetes manifests
  develop/              # Dev environment ConfigMaps
  homol/                # Staging environment ConfigMaps
  master/               # Production environment ConfigMaps
```

---

## Architecture Overview

```
React SPA
  Layout (Header, LeftMenu, FilterMenu)
    Switch (HashRouter)
      /dashboard -> DashboardDesktop (desktop) / DashboardMobile (mobile)
      /detail    -> DetailDesktop / DetailMobile
      /auth      -> Auth (login page)
      /logout    -> Logout (SSO redirect)

  Qlik Engine (QlikProvider)
    Connects via QCS (Web Integration ID) or QSE (ticket)
    Opens .qvf app, renders native Qlik objects

  Config (ConfigProvider)
    Fetches JSON from public/config/PagesConfig/
    Merges into single aggregated config object
```

### Context Provider Hierarchy

Providers are nested in `App.jsx` in this order:

`QlikProvider → SelectionsProvider → BookMarkProvider → ModalProvider → FilterBarProvider → LeftBarProvider → ConfigProvider → FiltersProvider → ExportIdProvider`

### Deployment Pipeline

```
Bitbucket Pipelines → Docker build → Push registry → Kubernetes apply
                       develop/      (ConfigMap dev)
                       homol/        (ConfigMap staging)
                       master/       (ConfigMap production)
```

Kubernetes uses APISIX ingress controller. Each environment has its own namespace and ConfigMap.

---

## Configuration

Dashboards and detail pages are defined in `public/config/`. The `ConfigService` (`src/services/Config.jsx`) fetches the JSON files and merges them into a single config object consumed by the page components.

To add a new visualization:
1. Create or edit the relevant page JSON in `public/config/PagesConfig/`
2. Deploy (no React code changes needed for standard cases)

---

## Docker

```bash
docker build -t basket-mix .
docker run -p 8080:8080 basket-mix
```

The Docker image uses a multi-stage build (Node 16 → nginx unprivileged 1.20) and serves the static build over port 8080.

---

## License

Internal use at Cluster Design.
