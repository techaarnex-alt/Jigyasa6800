const http = require("node:http");
const { randomBytes, scryptSync, timingSafeEqual } = require("node:crypto");
const { readFile, rename, writeFile } = require("node:fs/promises");
const path = require("node:path");

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 5173);
const root = __dirname;
const databasePath = path.join(root, "data.json");
const sessions = new Map();
const sessionDuration = 1000 * 60 * 60 * 8;
let databaseMutationQueue = Promise.resolve();
const supportedModules = new Set(["buyers", "project-status", "registration", "promoter", "daybook", "investor", "registry", "hr", "attendance", "follow-up", "calls", "kisan", "expenses", "report", "admin", "accounts", "notes", "plot-management", "partner-management", "finance-management", "land-management", "driver-management", "vehicle-management", "crm", "visitor-management", "customer-management", "task-management", "project-report", "pending-balance-report", "franchise-buyers", "franchise-booking", "franchise-pendency", "franchise-dues", "franchise-sale-report", "franchise-plot-hold", "franchise-partners", "franchise-partner-accounts", "franchise-partner-transactions"]);
const adminOnlyModules = new Set(["investor", "kisan", "report", "accounts", "finance-management", "project-report", "pending-balance-report", "admin"]);
const employeeModules = new Set(["buyers", "project-status"]);
const franchiseModules = new Set(["franchise-buyers", "franchise-booking", "project-status", "franchise-pendency", "franchise-dues", "franchise-sale-report", "franchise-plot-hold"]);
const partnerModules = new Set(["franchise-buyers", "project-status", "franchise-pendency", "franchise-dues", "franchise-sale-report"]);
const accountModules = new Set(["expenses", "report", "registration", "daybook", "registry", "plot-management", "land-management", "franchise-partner-accounts"]);
// Accounts staff need the partner list to select a payee, but cannot create or edit partners.
const accountReadOnlyModules = new Set(["franchise-partners"]);
const partnerReadOnlyModules = new Set(["project-status", "franchise-sale-report"]);
const managedRoles = new Set(["Employee", "Franchise", "Partner", "Account"]);
const files = new Map([
  ["/", "jigyasa-infratech-website.html"],
  ["/index.html", "jigyasa-infratech-website.html"],
  ["/home", "jigyasa-infratech-website.html"],
  ["/home.html", "jigyasa-infratech-website.html"],
  ["/jigyasa-infratech-website.html", "jigyasa-infratech-website.html"],
  ["/software", "software.html"],
  ["/software.html", "software.html"],
  ["/App.jsx", "App.jsx"],
  ["/assets/jigyasa-logo-mark.png", "assets/jigyasa-logo-mark.png"],
  ["/assets/hero-construction-building.png", "assets/hero-construction-building.png"],
]);
const types = { ".html": "text/html; charset=utf-8", ".jsx": "text/plain; charset=utf-8", ".png": "image/png" };

function send(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(body));
}

function emptyDatabase() {
  return { users: [], records: [], activity: [] };
}

function normalizeDatabase(data) {
  return {
    users: Array.isArray(data?.users) ? data.users : [],
    records: Array.isArray(data?.records) ? data.records : [],
    activity: Array.isArray(data?.activity) ? data.activity : [],
  };
}

async function readDatabase() {
  try {
    return normalizeDatabase(JSON.parse(await readFile(databasePath, "utf8")));
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    const data = emptyDatabase();
    await writeDatabase(data);
    return data;
  }
}

async function writeDatabase(data) {
  const temporaryPath = `${databasePath}.${randomBytes(8).toString("hex")}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await rename(temporaryPath, databasePath);
}

function serializeDatabaseMutation(work) {
  const task = databaseMutationQueue.catch(() => {}).then(work);
  databaseMutationQueue = task.catch(() => {});
  return task;
}

function getToken(request) {
  const header = request.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

function requireSession(request, response) {
  const token = getToken(request);
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(token);
    send(response, 401, { error: "Your session has expired. Please sign in again." });
    return null;
  }
  return { token, session };
}

async function readBody(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 1_000_000) throw new Error("Request is too large.");
  }
  return body ? JSON.parse(body) : {};
}

function cleanText(value, limit = 500) {
  return String(value || "").trim().slice(0, limit);
}

function validUsername(username) {
  return /^[a-z0-9._-]{3,80}$/.test(username);
}

function validPassword(password) {
  return password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
}

function createUser({ username, password, name, role, employeeRecordId = "" }) {
  const salt = randomBytes(16).toString("hex");
  return {
    username,
    name,
    role,
    salt,
    passwordHash: scryptSync(password, salt, 64).toString("hex"),
    employeeRecordId,
    createdAt: new Date().toISOString(),
  };
}

function sessionFor(user) {
  const token = randomBytes(32).toString("hex");
  const session = { username: user.username, name: user.name, role: user.role, expiresAt: Date.now() + sessionDuration };
  sessions.set(token, session);
  return { token, user: { name: user.name, role: user.role, username: user.username } };
}

function isAdmin(session) {
  return /admin/i.test(String(session?.role || ""));
}

function isPartner(session) {
  return /franchise|partner/i.test(String(session?.role || ""));
}

function isIndividualPartner(session) {
  return /partner/i.test(String(session?.role || ""));
}

function isAccount(session) {
  return /account/i.test(String(session?.role || ""));
}

function canAccessModule(session, module) {
  if (isAdmin(session)) return true;
  if (isAccount(session)) return accountModules.has(module) || accountReadOnlyModules.has(module);
  if (isPartner(session)) return (isIndividualPartner(session) ? partnerModules : franchiseModules).has(module);
  return employeeModules.has(module);
}

function canModifyModule(session, module) {
  return canAccessModule(session, module) && !(isPartner(session) && partnerReadOnlyModules.has(module)) && !(isAccount(session) && accountReadOnlyModules.has(module));
}

function canAccessRecord(session, record) {
  if (!canAccessModule(session, record.module)) return false;
  if (isIndividualPartner(session) && ["franchise-partner-accounts", "franchise-partner-transactions"].includes(record.module)) return record.owner === session.username || record.contact === session.name;
  return !isPartner(session) || record.module === "project-status" || record.owner === session.username;
}

function canModifyRecord(session, record) {
  // Buyer profiles are permanent customer records once created.
  if (record.module === "buyers") return false;
  if (isIndividualPartner(session) && ["franchise-partner-accounts", "franchise-partner-transactions"].includes(record.module)) return canModifyModule(session, record.module) && (record.owner === session.username || record.contact === session.name);
  return canModifyModule(session, record.module) && (!isPartner(session) || record.owner === session.username);
}

function recordFrom(input, existing) {
  const timestamp = new Date().toISOString();
  return {
    id: existing?.id || randomBytes(5).toString("hex").toUpperCase(),
    module: cleanText(input.module, 50),
    title: cleanText(input.title, 140),
    contact: cleanText(input.contact, 160),
    reference: cleanText(input.reference, 160),
    amount: cleanText(input.amount, 80),
    status: cleanText(input.status, 80) || "Open",
    notes: cleanText(input.notes, 4000),
    owner: existing?.owner || cleanText(input.owner, 80),
    kept: Boolean(input.kept),
    locked: Boolean(existing?.locked || input.locked || input.module === "notes"),
    createdAt: existing?.createdAt || timestamp,
    updatedAt: timestamp,
  };
}

async function handleApi(request, response, pathname) {
  if (pathname === "/api/setup-status" && request.method === "GET") {
    const data = await readDatabase();
    return send(response, 200, { setupRequired: data.users.length === 0 });
  }

  if (pathname === "/api/setup" && request.method === "POST") {
    return serializeDatabaseMutation(async () => {
      const input = await readBody(request);
      const username = cleanText(input.username, 80).toLowerCase();
      const password = String(input.password || "");
      const name = cleanText(input.name, 140);
      const data = await readDatabase();
      if (data.users.length) return send(response, 409, { error: "Initial setup has already been completed. Sign in with an existing account." });
      if (!validUsername(username)) return send(response, 400, { error: "Login ID must contain 3–80 lowercase letters, numbers, dots, hyphens, or underscores." });
      if (!validPassword(password)) return send(response, 400, { error: "Use at least 8 characters with uppercase, lowercase, and a number." });
      if (!name) return send(response, 400, { error: "Administrator name is required." });
      const user = createUser({ username, password, name, role: "Administrator" });
      data.users.push(user);
      await writeDatabase(data);
      return send(response, 201, sessionFor(user));
    });
  }

  if (pathname === "/api/login" && request.method === "POST") {
    const { username, password, accessType } = await readBody(request);
    const data = await readDatabase();
    const user = data.users.find((candidate) => candidate.username.toLowerCase() === cleanText(username, 80).toLowerCase());
    const providedHash = user ? scryptSync(String(password || ""), user.salt, 64) : null;
    const expectedHash = user?.passwordHash ? Buffer.from(user.passwordHash, "hex") : null;
    const valid = Boolean(user && providedHash && expectedHash?.length === providedHash.length && timingSafeEqual(providedHash, expectedHash));
    const requestedRole = cleanText(accessType, 40).toLowerCase();
    const roleMatches = !requestedRole || requestedRole === String(user?.role || "").toLowerCase() || (requestedRole === "admin" && isAdmin(user));
    if (!valid || !roleMatches) return send(response, 401, { error: "Incorrect login ID, password, or access type." });
    return send(response, 200, sessionFor(user));
  }

  if (pathname === "/api/logout" && request.method === "POST") {
    sessions.delete(getToken(request));
    return send(response, 200, { ok: true });
  }

  const auth = requireSession(request, response);
  if (!auth) return;

  if (pathname === "/api/users" && request.method === "GET") {
    if (!isAdmin(auth.session)) return send(response, 403, { error: "Only an administrator can view login accounts." });
    const data = await readDatabase();
    const users = data.users.map(({ username, name, role, employeeRecordId, createdAt }) => ({ username, name, role, employeeRecordId, createdAt }));
    return send(response, 200, { users });
  }

  if (pathname === "/api/users" && request.method === "POST") {
    if (!isAdmin(auth.session)) return send(response, 403, { error: "Only an administrator can create login IDs." });
    return serializeDatabaseMutation(async () => {
      const input = await readBody(request);
      const username = cleanText(input.username, 80).toLowerCase();
      const password = String(input.password || "");
      const name = cleanText(input.name, 140);
      const role = cleanText(input.role, 40);
      if (!validUsername(username)) return send(response, 400, { error: "Login ID must contain 3–80 lowercase letters, numbers, dots, hyphens, or underscores." });
      if (!validPassword(password)) return send(response, 400, { error: "Use at least 8 characters with uppercase, lowercase, and a number." });
      if (!name) return send(response, 400, { error: "Account holder name is required." });
      if (!managedRoles.has(role)) return send(response, 400, { error: "Choose Employee, Franchise, Partner, or Account access." });
      const data = await readDatabase();
      if (data.users.some(user => user.username.toLowerCase() === username)) return send(response, 409, { error: "This login ID is already in use." });
      const user = createUser({ username, password, name, role, employeeRecordId: cleanText(input.employeeRecordId, 80) });
      data.users.push(user);
      await writeDatabase(data);
      return send(response, 200, { user: { username, name, role, employeeRecordId: user.employeeRecordId, createdAt: user.createdAt } });
    });
  }

  if (pathname === "/api/employee-users" && request.method === "POST") {
    if (!isAdmin(auth.session)) return send(response, 403, { error: "Only an administrator can create employee login IDs." });
    return serializeDatabaseMutation(async () => {
      const input = await readBody(request);
      const username = cleanText(input.username, 80).toLowerCase();
      const password = String(input.password || "");
      const name = cleanText(input.name, 140);
      if (!validUsername(username)) return send(response, 400, { error: "Login ID must contain 3–80 lowercase letters, numbers, dots, hyphens, or underscores." });
      if (!validPassword(password)) return send(response, 400, { error: "Use at least 8 characters with uppercase, lowercase, and a number." });
      if (!name) return send(response, 400, { error: "Employee name is required." });
      const data = await readDatabase();
      const existing = data.users.find(user => user.username.toLowerCase() === username);
      if (existing) return send(response, 409, { error: "This login ID is already in use." });
      data.users.push(createUser({ username, password, name, role: "Employee", employeeRecordId: cleanText(input.employeeRecordId, 80) }));
      await writeDatabase(data);
      return send(response, 200, { user: { username, name, role: "Employee" } });
    });
  }

  if (pathname === "/api/password" && request.method === "POST") {
    const { currentPassword, newPassword } = await readBody(request);
    return serializeDatabaseMutation(async () => {
      if (!validPassword(String(newPassword || ""))) return send(response, 400, { error: "Use at least 8 characters with uppercase, lowercase, and a number." });
      const data = await readDatabase();
      const user = data.users.find((candidate) => candidate.username === auth.session.username);
      const currentHash = user ? scryptSync(String(currentPassword || ""), user.salt, 64) : null;
      const valid = Boolean(user && currentHash && timingSafeEqual(currentHash, Buffer.from(user.passwordHash, "hex")));
      if (!valid) return send(response, 400, { error: "Your current password is incorrect." });
      user.salt = randomBytes(16).toString("hex");
      user.passwordHash = scryptSync(String(newPassword), user.salt, 64).toString("hex");
      await writeDatabase(data);
      return send(response, 200, { ok: true });
    });
  }

  if (pathname === "/api/records" && request.method === "GET") {
    const data = await readDatabase();
    const records = data.records.filter((record) => canAccessRecord(auth.session, record));
    const activity = isAdmin(auth.session) ? (data.activity || []).slice(0, 100) : [];
    return send(response, 200, { records, activity, user: { name: auth.session.name, role: auth.session.role, username: auth.session.username } });
  }

  if (pathname === "/api/records" && request.method === "POST") {
    const input = await readBody(request);
    return serializeDatabaseMutation(async () => {
      if (!cleanText(input.module, 50) || !cleanText(input.title, 140)) return send(response, 400, { error: "Module and record title are required." });
      const data = await readDatabase();
      const index = input.id ? data.records.findIndex((record) => record.id === input.id) : -1;
      const existing = index >= 0 ? data.records[index] : null;
      if (!supportedModules.has(input.module) && !existing) return send(response, 400, { error: "This dashboard module is not available." });
      if (!canModifyModule(auth.session, input.module) || (existing && !canModifyRecord(auth.session, existing))) return send(response, 403, { error: "You do not have permission to change this module or record." });
      if (!isAdmin(auth.session)) input.owner = existing?.owner || auth.session.username;
      if (input.module === "attendance" && !isAdmin(auth.session)) {
        if (!/^LOCATION:-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?;accuracy:\d+/i.test(String(input.reference || ""))) return send(response, 400, { error: "Current device location is required before attendance can be marked." });
        input.title = auth.session.name;
        input.contact = auth.session.username;
        input.status = "Present";
      }
      const record = recordFrom(input, index >= 0 ? data.records[index] : null);
      if (index >= 0) data.records[index] = record;
      else data.records.unshift(record);
      data.activity = data.activity || [];
      data.activity.unshift({ id: randomBytes(10).toString("hex"), action: index >= 0 ? "Updated" : "Created", module: record.module, title: record.title, reference: record.reference, status: record.status, by: auth.session.name, at: new Date().toISOString() });
      data.activity = data.activity.slice(0, 1000);
      await writeDatabase(data);
      return send(response, 200, { record });
    });
  }

  const deleteMatch = pathname.match(/^\/api\/records\/([^/]+)$/);
  if (deleteMatch && request.method === "DELETE") {
    const id = decodeURIComponent(deleteMatch[1]);
    return serializeDatabaseMutation(async () => {
      const data = await readDatabase();
      const index = data.records.findIndex((record) => record.id === id);
      if (index < 0) return send(response, 404, { error: "Record not found." });
      if (!canModifyRecord(auth.session, data.records[index])) return send(response, 403, { error: "You do not have permission to delete this record." });
      if (data.records[index].locked) return send(response, 403, { error: "Protected cheque notes cannot be deleted." });
      const [deleted] = data.records.splice(index, 1);
      data.activity = data.activity || [];
      data.activity.unshift({ id: randomBytes(10).toString("hex"), action: "Deleted", module: deleted.module, title: deleted.title, reference: deleted.reference, status: deleted.status, by: auth.session.name, at: new Date().toISOString() });
      data.activity = data.activity.slice(0, 1000);
      await writeDatabase(data);
      return send(response, 200, { deleted });
    });
  }

  const keepMatch = pathname.match(/^\/api\/records\/([^/]+)\/keep$/);
  if (keepMatch && request.method === "POST") {
    const id = decodeURIComponent(keepMatch[1]);
    return serializeDatabaseMutation(async () => {
      const data = await readDatabase();
      const record = data.records.find((item) => item.id === id);
      if (!record) return send(response, 404, { error: "Record not found." });
      if (!canModifyRecord(auth.session, record)) return send(response, 403, { error: "You do not have permission to change this record." });
      record.kept = !record.kept;
      record.updatedAt = new Date().toISOString();
      data.activity = data.activity || [];
      data.activity.unshift({ id: randomBytes(10).toString("hex"), action: record.kept ? "Kept" : "Unkept", module: record.module, title: record.title, reference: record.reference, status: record.status, by: auth.session.name, at: record.updatedAt });
      data.activity = data.activity.slice(0, 1000);
      await writeDatabase(data);
      return send(response, 200, { record });
    });
  }

  return send(response, 404, { error: "API route not found." });
}

const server = http.createServer(async (request, response) => {
  const pathname = new URL(request.url, `http://${host}`).pathname;
  try {
    if (pathname.startsWith("/api/")) return await handleApi(request, response, pathname);
    const filename = files.get(pathname);
    if (!filename) return send(response, 404, { error: "Not found." });
    const content = await readFile(path.join(root, filename));
    response.writeHead(200, { "Content-Type": types[path.extname(filename)] || "application/octet-stream", "Cache-Control": "no-cache" });
    response.end(content);
  } catch (error) {
    const status = error instanceof SyntaxError ? 400 : 500;
    send(response, status, { error: status === 400 ? "Invalid request data." : "The server could not complete that action." });
  }
});

server.listen(port, host, () => {
  console.log(`Jigyasa Group Of Companies is running at http://${host}:${port}`);
  console.log("Open /software to complete secure first-run setup or sign in.");
});
