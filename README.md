# Student Academic Record Management System

A browser-based student management dashboard built with HTML5, CSS3, and vanilla JavaScript. It is designed as a beginner-friendly Full Stack Technologies assignment prototype.

## Features
- Dashboard showing total students, unique courses, average marks, and top performers
- Add, edit, and delete student records
- Search by student name, ID, email, or course
- Filter records by course
- Automatic grade calculation from marks
- Grade-distribution overview
- Form validation and duplicate student-ID checking
- Persistent browser storage with `localStorage`
- Export records to CSV
- Responsive layout for desktop and mobile screens

## Project structure
```text
student-academic-record-management/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to run
1. Download or clone this repository.
2. Open `index.html` in a modern browser, or open the folder in VS Code and use Live Server.
3. Add or edit records. The browser saves data in localStorage.

No package installation or database setup is required.

## Technologies
- HTML5: page structure, forms and table
- CSS3: responsive layout and visual styling
- JavaScript: CRUD operations, search, filtering, validation and calculations
- localStorage: data persistence in the current browser
- Blob and URL APIs: CSV export

## Grade rules used in this demo
- A+: 90–100
- A: 80–89.99
- B: 70–79.99
- C: 60–69.99
- D: 50–59.99
- F: below 50

These are example thresholds only. Update `gradeFor()` in `script.js` to match your institution's grading policy.

## Limitations
This is a frontend-only academic prototype. Data stays in the current browser and is not synchronized across devices. It has no real authentication, server-side validation, or shared database.

## Possible future enhancements
- Backend API and database integration
- Login with administrator/lecturer roles
- Attendance tracking
- Subject-wise marks and semester reports
- PDF report generation
- Import records from CSV

## Credits and originality
This implementation was written as a fresh educational example, drawing on common patterns found in public student-management projects such as:
- https://github.com/Aprine/Student_Management_System
- https://github.com/Dishalan-Coder/student-management-localstorage
- https://github.com/aashi1310/student-management-system

Review these projects for learning, and check their licenses before reusing their source code. This project should be tested and customized for your assignment before submission.
