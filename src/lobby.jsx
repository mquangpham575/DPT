import React from "react";

const Lobby = ({ user, handleLogout }) => {
  // Đảm bảo user không null trước khi truy cập metadata
  if (!user) return null;

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

export default Lobby;
