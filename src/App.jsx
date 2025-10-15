import React, { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// IMPORT AUTH FROM SERVICE FILE
import { auth } from "./services/firebase";

// --- COMPONENTS ---

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

// 3. Login/Signup Form Component (AuthView)
const AuthForm = ({ onMessage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuthAction = async (event) => {
    event.preventDefault();
    onMessage("", "info");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (password.length < 6) {
          onMessage("Mật khẩu phải có ít nhất 6 ký tự.", "error");
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error(isLogin ? "Login Error:" : "Signup Error:", error);
      let errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại.";
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = "Email hoặc mật khẩu không đúng.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email này đã được sử dụng.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Địa chỉ email không hợp lệ.";
      }
      onMessage(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-view" className="space-y-6">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-3 text-lg font-medium border-b-2 transition duration-300 ${
            isLogin
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-indigo-600 hover:border-indigo-600"
          }`}
        >
          Đăng Nhập
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-3 text-lg font-medium border-b-2 transition duration-300 ${
            !isLogin
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-indigo-600 hover:border-indigo-600"
          }`}
        >
          Đăng Ký
        </button>
      </div>

      <div id="auth-form-container">
        <form
          id={isLogin ? "login-form" : "signup-form"}
          className="space-y-5 mt-4"
          onSubmit={handleAuthAction}
        >
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder={isLogin ? "Mật khẩu" : "Mật khẩu (ít nhất 6 ký tự)"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-lg transition duration-300 shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : isLogin
                ? "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
                : "bg-purple-600 hover:bg-purple-700 hover:shadow-lg"
            }`}
          >
            {loading
              ? "Đang xử lý..."
              : isLogin
              ? "Đăng Nhập"
              : "Đăng Ký Tài Khoản Mới"}
          </button>
        </form>
      </div>

      <div className="text-center text-sm text-gray-500 pt-2">
        Note: You only need email and password to sign up.
      </div>
    </div>
  );
};

// 4. Lobby Component (User View)
const Lobby = ({ user, handleLogout }) => {
  const creationTime = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleString("vi-VN")
    : "Không rõ";

  const emailVerifiedStatus = user.emailVerified ? (
    <span className="text-lg font-bold text-green-600">Đã xác minh ✅</span>
  ) : (
    <span className="text-lg font-bold text-red-500">Chưa xác minh ❌</span>
  );

  return (
    <div className="w-full max-w-5xl bg-white p-6 md:p-12 rounded-2xl shadow-2xl lobby-view card">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-gray-100">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-2 md:mb-0">
          Trang Chính Hệ Thống
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center py-2 px-4 text-sm bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
        >
          Đăng Xuất
        </button>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Thông Tin Tài Khoản
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-indigo-50 rounded-xl border border-indigo-200">
          <div>
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
              Email
            </p>
            <p className="text-lg font-bold text-gray-800 break-words">
              {user.email || "No Email"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
              ID Người Dùng
            </p>
            <p className="font-mono text-sm inline-block bg-indigo-100 p-2 rounded-lg text-gray-700 break-all">
              {user.uid}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
              Thời Gian Tạo
            </p>
            <p className="text-lg text-gray-700">{creationTime}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
              Trạng Thái Xác Minh Email
            </p>
            {emailVerifiedStatus}
          </div>
        </div>
      </section>
    </div>
  );
};

// 5. Main App Component
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

  // Render nội dung chính: Spinner, Lobby, hoặc AuthForm
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
