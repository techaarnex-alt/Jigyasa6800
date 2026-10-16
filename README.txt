Jigyasa Group Of Companies — Website Code
=================================

1. jigyasa-infratech-website.html
   -> Public-facing company website. The previous internal links are now
      separated from this page.

2. App.jsx
   -> Plain React component version for an existing React project.

3. software.html
   -> Staff-only software login and dashboard. Its top bar follows the
   requested numbered order: Dashboard, Buyers, Project Status,
   Registration, Promoters, Daybook, Investor Management, Registry, HR,
   Attendance, Kisan, Reports, and Accounts. HR Management contains Follow
   Up, Calls, Notes, Vehicle Management, and Visitor Management; HR
   Management also contains Attendance Management; Reports
   contains Pending Balance Report. Plot Management and Partner Management
   are separate dashboard commands; Land Management contains Kisan. The
   Account role has access only to Expenses and its focused Expense Report.
   Cheque-alert Notes are protected from deletion.

4. data.json
   -> Local persistent data for the staff software. It starts empty and is
      created automatically when the server starts.

The public website has a Software Login button. The staff software uses the
same green, gold and blue visual style, while keeping the operational tools
away from public visitors. Every module has searchable saved records and
allows staff to type, add, edit, save, keep, and delete entries. The Report
module can export a CSV of all saved records. The Admin module also lets the
signed-in user change the starter password.

Contact details already filled in:
- Address: Sector 14/105, Vrindavan Yojan, Telibagh, Lucknow – 226029
- Phone: +91 93360 81002

Note: "current sites" (Vrindavan Yojna, Krishna Vihar Extension,
Ganga Residency) and their prices/plot sizes are placeholder examples
— swap in real project names, prices and inventory before publishing.

Run locally
-----------

1. Open a terminal in this folder.
2. Run: npm run dev
3. Open: http://127.0.0.1:5173

The included server uses only Node.js built-ins, so npm install is not needed.
Open http://127.0.0.1:5173/software.html to access the secure business software.
Press Ctrl+C in the terminal to stop the local server.

Staff accounts and operational data
-----------------------------------

`data.json` starts with no accounts or records and is intentionally excluded
from version control. On the first visit to `/software`, create a private
administrator account with a password of at least 8 characters, including
uppercase, lowercase, and a number. That administrator can then create real
Employee, Franchise, Partner, and Account logins from Admin → Login & Access
Management. Do not commit or share `data.json`.

Access separation
-----------------

The Admin panel and its protected records are available only to the
Administrator role. Franchise logins have buyer, booking, project-status,
pendency, EMI/custom dues, sale-report, and plot-hold workspaces. Partner
logins have buyer, project-status, pendency, EMI/custom dues, and sale-report
workspaces only: Booking and Plot Hold are unavailable. Account logins have
only Expenses and Reports, where project expenses are shown separately from all
other expenses. Franchise and Partner records are linked to their login ID;
Project Status and Sale Report are read-only in those workspaces.
