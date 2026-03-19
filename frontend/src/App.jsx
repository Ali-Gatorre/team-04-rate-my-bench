import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BenchDetailPage from "./pages/BenchDetailPage";
import AddBenchPage from "./pages/AddBenchPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import {
  fetchCurrentUser,
  fetchNotifications,
  getAuthToken,
  removeAuthToken,
} from "./services/api";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function loadSession() {
      const token = getAuthToken();
      if (!token) return;

      try {
        const user = await fetchCurrentUser();
        setCurrentUser(user);

        const notificationsData = await fetchNotifications();
        setNotifications(notificationsData);
      } catch (error) {
        removeAuthToken();
        setCurrentUser(null);
        setNotifications([]);
      }
    }

    loadSession();
  }, []);

  function handleLogout() {
    removeAuthToken();
    setCurrentUser(null);
    setNotifications([]);
    window.location.href = "/";
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <BrowserRouter>
      <Navbar
        currentUser={currentUser}
        notificationsCount={unreadCount}
        onLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bench/:id" element={<BenchDetailPage />} />
        <Route path="/add-bench" element={<AddBenchPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/notifications"
          element={<NotificationsPage notifications={notifications} />}
        />
        <Route path="/profile/:id" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
