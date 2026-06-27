import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Container, Tabs, Tab, Box } from "@mui/material";
import { Notifications, PriorityHigh } from "@mui/icons-material";
import { Log, setToken } from "affordmed-logging-middleware";
import { NotificationsPage } from "./pages/NotificationsPage";
import PriorityPage from "./pages/PriorityPage";

const theme = createTheme({
  palette: { primary: { main: "#1565c0" }, background: { default: "#f5f7fa" } },
  typography: { fontFamily: "'Inter', -apple-system, sans-serif" },
});

setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuc2JoYXZ5YXNyaTI0QGdtYWlsLmNvbSIsImV4cCI6MTc4MjUzNzk0OSwiaWF0IjoxNzgyNTM3MDQ5LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNDE1OGNmY2ItYzNjOC00NDg1LWI2MmUtZmQ2MTBmNDM1ZmYwIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYmhhdnlhc3JpIiwic3ViIjoiMDM0OThlNTAtNGViMC00NGI3LWE3ZWUtMzQwOWI1ZGE4ZGEyIn0sImVtYWlsIjoibnNiaGF2eWFzcmkyNEBnbWFpbC5jb20iLCJuYW1lIjoiYmhhdnlhc3JpIiwicm9sbE5vIjoiMjNocjFhMDU3NyIsImFjY2Vzc0NvZGUiOiJhVGt5YnMiLCJjbGllbnRJRCI6IjAzNDk4ZTUwLTRlYjAtNDRiNy1hN2VlLTM0MDliNWRhOGRhMiIsImNsaWVudFNlY3JldCI6IlNSWHhDc3RHVkJndlpTQ3oifQ.6-51RNmmJVEym91dROYjMLvf2zNOIKuz5CyR5b3S5Jo");

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const tab = location.pathname === "/priority" ? 1 : 0;

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        <Notifications sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Campus Notifications</Typography>
        <Tabs
          value={tab}
          onChange={(e, v) => {
            navigate(v === 0 ? "/" : "/priority");
            Log("frontend", "info", "component", `Navigated to ${v === 0 ? "All" : "Priority"} page`);
          }}
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab icon={<Notifications />} label="All" />
          <Tab icon={<PriorityHigh />} label="Priority" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  useEffect(() => {
    Log("frontend", "info", "config", "App initialized");
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
          <Routes>
            <Route path="/" element={<NotificationsPage />} />
            <Route path="/priority" element={<PriorityPage />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}
