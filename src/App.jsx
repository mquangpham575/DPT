import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";

// IMPORT AUTH FROM SERVICE FILE
import { auth } from "./services/firebase";

// IMPORT COMPONENTS
import Lobby from "./lobby";
import AuthForm from "./login";

// 1. Loading Spinner Component
const Spinner = () => (
  <div id="init-spinner" className="text-center p-8">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
    <p className="text-gray-600">Initializing system...</p>
  </div>
);

// 2. Message Box Component
const MessageBox = ({ message, type }) => {
  if (!message) return null;

  let classes = "p-3 mb-4 rounded-lg text-sm ";
  if (type === "error") {
    classes += "bg-red-100 text-red-700";
  } else if (type === "success") {
    classes += "bg-green-100 text-green-700";
  } else {
    classes += "bg-blue-100 text-blue-700";
  }

  return (
    <div id="message-box" className={classes} role="alert">
      {message}
    </div>
  );
};

// 3. Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const handleMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    if (msg) {
      setTimeout(() => setMessage(""), 5000);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    handleMessage("Logging out...", "info");
    try {
      await signOut(auth);
      handleMessage("Logged out successfully.", "info");
    } catch (error) {
      handleMessage("Logout failed.", "error");
    }
  };

  let content;

  if (loading) {
    content = <Spinner />;
  } else if (user) {
    content = <Lobby user={user} handleLogout={handleLogout} />;
  } else {
    content = <AuthForm onMessage={handleMessage} />;
  }

  const shouldWrapContent = !user;

  return (
    <div
      id="app-container"
      className="min-h-screen flex items-center justify-center p-4"
    >
      {shouldWrapContent ? (
        <div className="w-full max-w-lg bg-white p-6 md:p-10 rounded-xl shadow-2xl app-card-wrapper card">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Hệ Thống Đăng Nhập & Quản Lý
          </h1>
          <MessageBox message={message} type={messageType} />
          {content}
        </div>
      ) : (
        content
      )}
    </div>
  );
};

export default App;
