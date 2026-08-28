# Portal for Small Business

A full-stack Next.js & PHP application for managing shifts, schedules, and salaries in small businesses.

I worked on this project independently from mid-2023 to 2025 and, mainly, it was my playground for learning code and trying new things.

## The Core Idea and Addressed Problems

The application is aimed to solve problems of **small businesses**.

### For workers

_Problem:_ Working schedules and salary info (e.g. payslips) are usually only accessible on paper or not accessible at all.

_App's Solution:_ An opportunity to have a one-click access to all work-related information, including working schedules and salary with detailed breakdown, through the app on their phones.

### For managers

_Problem:_ Schedules planning and salary calculations are usually performed in excel spreadsheets, which are most likely a "black box" for everyone except their author.

_App's Solution:_ Application with user-friendly UI and rich functionality, which allows planning, automatic calculations, and information sharing.

## Main Features

- **Salaries:** Managers can control earnings, reductions, payments, and taxes of employees, and create payslips with automatic calculations.
- **Schedules:** Shift schedules with flexible options can be created by managers and accessed by employees through the web app.
- **Access Levels:** Users are divided into managers and regular employees with separate access levels and permissions.
- **Multi-Organizational Accounts:** All users can have an account with multiple connected firms, in which they may be a regular employee or a manager.

## Stack

- **Frontend:** Next.js, TypeScript, SASS/SCSS
- **Backend:** PHP, SQL
- **DB & Caching:** MySQL, Redis
- **Deployment:** Linux, Docker, Apache, Traefik

## Highlights

Despite the fact that this repo has many things I would have done completely differently now (and I feel a little stupid when I look at them), it definitely has some points I am proud of:

- **Codebase size and full-cycle development:** The project was built from idea to production deployment entirely by myself.
- **Coding in pre-AI era:** AI assistants were not that helpful back then and I had to spend _a lot_ of time reading official documentations and stack overflow.
- **Broad range of technologies:** Covered the full spectrum of development, from TypeScript, Next.js and its caching, to integrating online payment transactions API, Linux server administration and Traefik configuration.

### PHP and Service Layer Pattern

I am especially proud of the project's backend written in PHP with Service Layer Pattern. Controllers, Models, Repositories, Services and etc. were implemented from scratch to cover the business logic of the application and they worked really good.

## Lessons Learned

- **Write better code:** As mentioned before, I improved a lot since the project was finished and can see many mistakes I made.
- **Use modern stack:** Backends on LAMP will, probably, always be around. However, for new projects it is better to choose something more modern.
- **Try to avoid JavaScript Date object.**
- **Git:** Use Git as a smart tool but not as a cloud saving.
- **Libraries over custom solutions:** Realized the importance of using reliable libraries instead of reinventing the wheel.
- **Testing:** Testing is important.
