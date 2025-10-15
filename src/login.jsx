import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "./services/firebase";

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

export default AuthForm;
