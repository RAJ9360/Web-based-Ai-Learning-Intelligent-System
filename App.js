import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

/* ===== Pages ===== */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Levels from "./pages/Levels";
import Quiz from "./pages/Quiz";
import AIResult from "./pages/AIResult";   // ✅ Only this now
import Progress from "./pages/Progress";
import Search from "./pages/Search";
import VideoLibrary from "./pages/VideoLibrary";

/* ===== Admin Pages ===== */
import AdminDashboard from "./pages/AdminDashboard";
import AdminSubjects from "./pages/admin/AdminSubjects";
import AdminQuizzes from "./pages/admin/AdminQuizzes";
import AdminVideos from "./pages/admin/AdminVideos";

/* ===== Components ===== */
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check login on refresh
  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    if (status === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>

      {/* ===== Navbar ===== */}
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      <Routes>

        {/* ===== Public Routes ===== */}
        <Route
          path="/"
          element={<Home isLoggedIn={isLoggedIn} />}
        />

        <Route path="/search" element={<Search />} />

        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route path="/register" element={<Register />} />

        {/* ===== Protected User Routes ===== */}

        <Route
          path="/dashboard"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/levels"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Levels />
            </PrivateRoute>
          }
        />

        <Route
          path="/quiz"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Quiz />
            </PrivateRoute>
          }
        />

        {/* ✅ AI RESULT PAGE */}
        <Route
          path="/recommendation"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <AIResult />
            </PrivateRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Progress />
            </PrivateRoute>
          }
        />

        <Route
          path="/videos"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <VideoLibrary />
            </PrivateRoute>
          }
        />

        {/* ===== Admin Routes ===== */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/subjects"
          element={
            <AdminRoute>
              <AdminSubjects />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/quizzes"
          element={
            <AdminRoute>
              <AdminQuizzes />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/videos"
          element={
            <AdminRoute>
              <AdminVideos />
            </AdminRoute>
          }
        />

      </Routes>

      {/* ===== Chatbot ===== */}
      {isLoggedIn && <Chatbot />}

    </Router>
  );
}

export default App;