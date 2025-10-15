import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// === FIREBASE CONFIG: INSERT YOUR ACTUAL CONFIG HERE ===
const firebaseConfig = {
  // Replace with your actual Firebase config keys
  apiKey: "AIzaSyBE12I70R5wQ2_XNL3agnRT5PiKtq_kSr8",
  authDomain: "doan-dpt.firebaseapp.com",
  projectId: "doan-dpt",
  storageBucket: "doan-dpt.firebasestorage.app",
  messagingSenderId: "534813204985",
  appId: "1:534813204985:web:6ed168d3b2dd1c22039d28",
  measurementId: "G-XL1F6C5DHR",
};

let auth = null;

// --- Utility Functions for UI and Messages ---
const getCurrentPage = () => {
  // Gets the filename (e.g., 'login.html' or 'lobby.html')
  return (
    window.location.pathname.split("/").pop().toLowerCase() || "index.html"
  );
};

const showMessage = (message, type = "info") => {
  const msgBox = document.getElementById("message-box");
  if (!msgBox) return;

  msgBox.textContent = message;
  msgBox.className = "p-3 mb-4 rounded-lg text-sm"; // Reset classes

  if (type === "error") {
    msgBox.classList.add("bg-red-100", "text-red-700");
  } else if (type === "success") {
    msgBox.classList.add("bg-green-100", "text-green-700");
  } else {
    msgBox.classList.add("bg-blue-100", "text-blue-700");
  }
  msgBox.classList.remove("hidden");
};

const hideSpinner = () => {
  const spinnerId =
    getCurrentPage() === "lobby.html" ? "init-spinner-lobby" : "init-spinner";
  const spinner = document.getElementById(spinnerId);
  if (spinner) {
    spinner.classList.add("hidden");
  }
};

const showAuthView = () => {
  // Only exists in login.html
  const authView = document.getElementById("auth-view");
  if (authView) {
    authView.classList.remove("hidden");
  }
  hideSpinner();
};

const displayLobbyContent = (user) => {
  // Only exists in lobby.html
  const lobbyView = document.getElementById("lobby-view");
  if (lobbyView) {
    lobbyView.classList.remove("hidden");
  }

  // Update user info fields
  if (document.getElementById("user-email-display"))
    document.getElementById("user-email-display").textContent =
      user.email || "No Email";
  if (document.getElementById("user-id-display"))
    document.getElementById("user-id-display").textContent = user.uid;
  if (
    document.getElementById("user-creation-time") &&
    user.metadata.creationTime
  ) {
    document.getElementById("user-creation-time").textContent = new Date(
      user.metadata.creationTime
    ).toLocaleString("vi-VN");
  }
  const verifiedStatus = document.getElementById("email-verified-status");
  if (verifiedStatus) {
    if (user.emailVerified) {
      verifiedStatus.textContent = "Đã xác minh ✅";
      verifiedStatus.className = "text-lg font-bold text-green-600";
    } else {
      verifiedStatus.textContent = "Chưa xác minh ❌";
      verifiedStatus.className = "text-lg font-bold text-red-500";
    }
  }

  // Attach logout handler
  const logoutButtonLobby = document.getElementById("logout-button-lobby");
  if (logoutButtonLobby) {
    logoutButtonLobby.onclick = handleLogout;
  }

  hideSpinner();
};

// --- Firebase Auth Handlers ---
const handleLogin = async (event) => {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showMessage("Đăng nhập thành công! Đang chuyển hướng...", "success");
  } catch (error) {
    console.error("Login Error:", error);
    let errorMessage =
      "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.";
    if (error.code === "auth/invalid-credential") {
      errorMessage = "Email hoặc mật khẩu không đúng.";
    }
    showMessage(errorMessage, "error");
  }
};

const handleSignup = async (event) => {
  event.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (password.length < 6) {
    showMessage("Mật khẩu phải có ít nhất 6 ký tự.", "error");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    showMessage("Đăng ký thành công! Đang chuyển hướng...", "success");
  } catch (error) {
    console.error("Signup Error:", error);
    let errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email này đã được sử dụng.";
    }
    showMessage(errorMessage, "error");
  }
};

const handleLogout = async () => {
  try {
    await signOut(auth);
    // The onAuthStateChanged listener will handle the redirect
  } catch (error) {
    console.error("Logout Error:", error);
    showMessage("Đăng xuất thất bại. Vui lòng thử lại.", "error");
  }
};

// --- Core Auth Listener and Redirect Logic ---
const setupAuthStateListener = () => {
  const currentPage = getCurrentPage();

  onAuthStateChanged(auth, (user) => {
    if (user && user.email) {
      // USER IS LOGGED IN (with email/pass)
      if (currentPage === "index.html") {
        // Redirect to Lobby
        console.log("Logged in. Redirecting to lobby.html");
        window.location.href = "lobby.html";
      } else if (currentPage === "lobby.html") {
        // Stay on Lobby and display content
        displayLobbyContent(user);
      }
    } else {
      // USER IS LOGGED OUT
      if (currentPage === "lobby.html") {
        // Redirect to Login
        console.log("Logged out. Redirecting to login.html");
        window.location.href = "index.html";
      } else if (currentPage === "index.html") {
        // Stay on Login and show auth forms
        showAuthView();
      }
    }
  });
};

// --- UI Setup for Login Page ---
const setupLoginUI = () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
    signupForm.addEventListener("submit", handleSignup);

    // Tab switching logic
    tabLogin.addEventListener("click", () => {
      loginForm.classList.remove("hidden");
      signupForm.classList.add("hidden");
      tabLogin.classList.replace("text-gray-500", "text-indigo-600");
      tabLogin.classList.add("border-indigo-600");
      tabSignup.classList.replace("text-indigo-600", "text-gray-500");
      tabSignup.classList.remove("border-indigo-600");
    });

    tabSignup.addEventListener("click", () => {
      signupForm.classList.remove("hidden");
      loginForm.classList.add("hidden");
      tabSignup.classList.replace("text-gray-500", "text-indigo-600");
      tabSignup.classList.add("border-indigo-600");
      tabLogin.classList.replace("text-indigo-600", "text-gray-500");
      tabLogin.classList.remove("border-indigo-600");
    });
  }
};

// --- Initial App Load ---
const initFirebase = () => {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    setupAuthStateListener();
  } catch (error) {
    console.error("Firebase Init Error:", error);
    showMessage(
      "Không thể khởi tạo Firebase. Vui lòng kiểm tra console.",
      "error"
    );
    hideSpinner();
    showAuthView();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setupLoginUI(); // Setup UI specific to login page
  initFirebase(); // Start Firebase initialization and listening
});
