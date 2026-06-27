import { Log } from "affordmed-logging-middleware";

const API_BASE = "http://4.224.186.213/evaluation-service";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuc2JoYXZ5YXNyaTI0QGdtYWlsLmNvbSIsImV4cCI6MTc4MjU0NzI5NywiaWF0IjoxNzgyNTQ2Mzk3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNGRiZDE3ZjItOGY2Mi00ZDZhLWFiMWMtMWUwODQ4YTNmMjY2IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYmhhdnlhc3JpIiwic3ViIjoiMDM0OThlNTAtNGViMC00NGI3LWE3ZWUtMzQwOWI1ZGE4ZGEyIn0sImVtYWlsIjoibnNiaGF2eWFzcmkyNEBnbWFpbC5jb20iLCJuYW1lIjoiYmhhdnlhc3JpIiwicm9sbE5vIjoiMjNocjFhMDU3NyIsImFjY2Vzc0NvZGUiOiJhVGt5YnMiLCJjbGllbnRJRCI6IjAzNDk4ZTUwLTRlYjAtNDRiNy1hN2VlLTM0MDliNWRhOGRhMiIsImNsaWVudFNlY3JldCI6IlNSWHhDc3RHVkJndlpTQ3oifQ.6-51RNmmJVEym91dROYjMLvf2zNOIKuz5CyR5b3S5Jo";

export async function fetchNotifiexport async function fetchNotifiexport async function fetchNotifiexport asynteexport async function fetchNotifiexpoatiexport async function fetchNotifiexport async functioexport async function fetchNotifiexport async function fee) url += `&notification_type=${notification_type}`;
    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${AUTH_TOKEN}` },
    });
    if (!res.ok) {
      await Log("frontend", "error", "api", `status ${res.status}`);
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    await Log("frontend", "info", "api", `got ${(data.notifications||[]).length} items`);
    return data.notifications || [];
  } catch (err) {
    await Log("frontend", "error", "api", "fetch failed");
    throw err;
  }
}
