const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuc2JoYXZ5YXNyaTI0QGdtYWlsLmNvbSIsImV4cCI6MTc4MjU0NzI5NywiaWF0IjoxNzgyNTQ2Mzk3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNGRiZDE3ZjItOGY2Mi00ZDZhLWFiMWMtMWUwODQ4YTNmMjY2IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYmhhdnlhc3JpIiwic3ViIjoiMDM0OThlNTAtNGViMC00NGI3LWE3ZWUtMzQwOWI1ZGE4ZGEyIn0sImVtYWlsIjoibnNiaGF2eWFzcmkyNEBnbWFpbC5jb20iLCJuYW1lIjoiYmhhdnlhc3JpIiwicm9sbE5vIjoiMjNocjFhMDU3NyIsImFjY2Vzc0NvZGUiOiJhVGt5YnMiLCJjbGllbnRJRCI6IjAzNDk4ZTUwLTRlYjAtNDRiNy1hN2VlLTM0MDliNWRhOGRhMiIsImNsaWVudFNlY3JldCI6IlNSWHhDc3RHVkJndlpTQ3oifQ.6-51RNmmJVEym91dROYjMLvf2zNOIKuz5CyR5b3S5Jo";


const VALID_STACKS = ["backend", "frontend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const BACKEND_PACKAGES = ["cache","controller","cron_job","db","domain","handler","repository","route","service"];
const FRONTEND_PACKAGES = ["api","component","hook","page","state","style"];
const SHARED_PACKAGES = ["auth","config","middleware","utils"];

export function setToken(token) {
  authToken = token;
}

function validate(stack, level, pkg) {
  if (!VALID_STACKS.includes(stack)) throw new Error(`Invalid stack "${stack}"`);
  if (!VALID_LEVELS.includes(level)) throw new Error(`Invalid level "${level}"`);
  const allowed = stack === "backend"
    ? [...BACKEND_PACKAGES, ...SHARED_PACKAGES]
    : [...FRONTEND_PACKAGES, ...SHARED_PACKAGES];
  if (!allowed.includes(pkg)) throw new Error(`Invalid package "${pkg}" for stack "${stack}"`);
}

export async function Log(stack, level, pkg, message) {
  const s = String(stack).trim().toLowerCase();
  const l = String(level).trim().toLowerCase();
  const p = String(pkg).trim().toLowerCase();
  const m = String(message).trim();

  validate(s, l, p);
  if (!m) throw new Error("Log message must not be empty");

  const body = { stack: s, level: l, package: p, message: m };
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

  try {
    const res = await fetch(LOG_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`[LogMiddleware] API error ${res.status}: ${errText}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`[LogMiddleware] Network error: ${err.message}`);
    return null;
  }
}
