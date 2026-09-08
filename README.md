# FlaccoTips --- Tip Tracker & Analytics Dashboard

FlaccoTips is a personal tip-tracking and earnings analytics dashboard
built for servers and tipped workers.

Instead of simply recording tips, the goal of the project is to turn
shift data into useful insights about earnings, tip performance, sales,
hours worked, and long-term trends.

## Features

-   Log individual work shifts
-   Track cash and credit card tips separately
-   Track total sales
-   Track hours worked
-   Track tables served
-   Track tip-outs
-   Include hourly wages in total earnings
-   Switch between **All Tips** and **Card Only**
-   View earnings across different time periods
-   Navigate between previous and future periods
-   Visualize earnings with interactive charts
-   View summary statistics for selected periods

## Analytics

FlaccoTips calculates useful metrics from raw shift data, including:

-   Total earnings
-   Gross tips
-   Net tips after tip-out
-   Average tip percentage
-   Tips per hour
-   Earnings per hour
-   Total sales
-   Total tables served

Rather than storing calculated statistics, the application stores
individual shift data and derives analytics dynamically.

This allows the same data to be analyzed across different time ranges.

## Time-Based Analysis

The dashboard supports:

-   Day
-   Week
-   Month
-   Year

Changing the selected period updates the dashboard metrics, graphs, and
shift history.

Users can also navigate backward and forward through periods to compare
performance over time.

## Cash Tip Toggle

Cash tips and credit card tips are stored separately.

The dashboard includes an **All Tips / Card Only** toggle that allows
analytics to be recalculated with or without cash tips.

This makes it possible to compare recorded card income with actual
earnings including cash.

## Tech Stack

-   Next.js 16
-   React 19
-   TypeScript
-   Tailwind CSS
-   Recharts
-   Supabase
-   PostgreSQL
-   date-fns
-   React Compiler

## Project Structure

``` text
tip-tracker/
├── app/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── dashboard/
│       ├── AnalyticsChart.tsx
│       ├── CashTipsToggle.tsx
│       ├── MetricCards.tsx
│       ├── ShiftForm.tsx
│       └── TimeRangeSelector.tsx
├── lib/
│   ├── analytics.ts
│   └── supabase.ts
└── public/
```

## Database

Each shift stores raw data such as:

-   Date
-   Shift type
-   Hours worked
-   Tables served
-   Total sales
-   Credit tips
-   Cash tips
-   Tip out
-   Hourly wage

Analytics are then calculated from these values rather than being stored
separately.

## Environment Variables

Create a `.env.local` file in the root of the project:

``` env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Do not commit `.env.local` or private credentials to GitHub.

## Getting Started

Install dependencies:

``` bash
npm install
```

Start the development server:

``` bash
npm run dev
```

Open:

``` text
http://localhost:3000/dashboard
```

## Planned Features

FlaccoTips is currently under active development.

-   Multiple graph metrics
-   Tip percentage graphs
-   Tips-per-hour graphs
-   Sales graphs
-   Earnings-per-hour graphs
-   Week-over-week comparisons
-   Month-over-month comparisons
-   Earnings projections
-   Shift editing and deletion
-   Better mobile dashboard
-   Authentication
-   Secure user-specific data
-   Historical trend analysis
-   Income forecasting
-   More advanced statistics

## Long-Term Goal

The long-term goal is to build FlaccoTips into more than a tip log.

With enough historical shift data, the dashboard can answer questions
such as:

-   Which days generate the highest earnings?
-   Are lunch or dinner shifts more profitable?
-   How much am I actually earning per hour?
-   Does serving more tables affect my average tip percentage?
-   How much do cash tips contribute to my income?
-   Are my tips improving over time?
-   What should I expect to earn next week or next month?
-   Which types of shifts provide the best return for time worked?

The project combines practical personal finance tracking with data
visualization and statistical analysis.

## Status

🚧 **MVP / Active Development**

The core dashboard, shift tracking, time filtering, cash-tip filtering,
and analytics system are currently being developed.
