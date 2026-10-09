# TripWise

A frontend-only travel planner and group expense splitting application built using HTML, CSS and JavaScript.

## 1. Project Overview

TripWise helps users plan and manage group trips in one place. Users can create and manage trips, add members, organize day-wise itineraries, and track shared expenses.

The main feature, **Split It**, allows users to split expenses among selected trip members, calculate individual contributions and balances, and understand who owes money and who should receive it.

## 2. Key Features

- Create, edit and delete trips.
- Add and manage trip members.
- Create, edit and delete day-wise itinerary activities.
- Maintain separate itineraries for individual trips.
- Add, edit and delete shared expenses.
- Split expenses among all members or selected participants.
- Calculate individual contributions and outstanding balances.
- Display expense analytics, including total, average, highest and lowest expenses, and highest spender.
- Use Web Workers to perform expense calculations and analytics.
- Store application data using browser `localStorage`.
- Responsive design for mobile, tablet and desktop.

## 3. Technology & Project Specifications

- **HTML5** – Page structure, forms and content.
- **CSS3** – Styling, layouts and responsive design.
- **JavaScript (ES6+)** – DOM manipulation, event handling, CRUD operations and expense calculations.
- **Web Storage API** – Persistent data storage using `localStorage`.
- **Web Workers API** – Background processing for expense splitting and analytics.
- **Git & GitHub** – Version control and project hosting.

### Project Specifications

- Frontend-only application.
- Multiple HTML pages for different sections.
- No external JavaScript libraries or frameworks.
- CRUD operations for trips, members, itinerary activities and expenses.
- Data persistence across page refreshes using browser storage.

## 4. Project Proposal

### Problem Statement

Planning group trips involves managing travel activities, coordinating members and dividing shared expenses. Handling these tasks separately can become confusing and make it difficult to determine who owes whom.

### Project Goal

TripWise combines **travel itinerary management** and **group expense splitting** into a single, simple application. It aims to make group travel organization easier by keeping trip details, activities and shared expenses together.

### CRUD Operations

| Operation | Examples |
|---|---|
| Create | Trips, members, activities and expenses |
| Read | Trips, members, itineraries, expenses and balances |
| Update | Trip details, member information, activities and expenses |
| Delete | Trips, members, activities and expenses |

## 5. Project Structure

```text
TripWise/
├── index.html
├── README.md
├── LICENSE
├── assets/
├── css/
│   ├── styles.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── itinerary.js
│   ├── expenses.js
│   ├── helpers/
│   │   ├── calculations.js
│   │   ├── storage.js
│   └── workers/
│       └── splitWorker.js
└── pages/
    ├── itinerary.html
    └── expenses.html
```

## 6. Setup & Installation

### Prerequisites

- A modern web browser.
- Visual Studio Code or another code editor.
- Git (optional, for cloning the repository).

### Run Locally

Clone the repository:

```bash
git clone https://github.com/abhinav-1002/TripWise.git
```

Navigate to the project directory:

```bash
cd TripWise
```

Open the project in Visual Studio Code and run `index.html` in a modern browser.

**Note:** If browser restrictions affect JavaScript modules or Web Workers, run the project using the VS Code Live Server extension or another local HTTP server.

## 7. License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.
