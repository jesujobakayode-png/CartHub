import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { joinRoom, leaveRoom, connectSocket, disconnectSocket } from "../utils/socket";

function getUserId(user) {
  return user?.id || user?._id || user?.user?.id || user?.user?._id;
}

function getUserRole(user) {
  return user?.role || user?.user?.role;
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const userId = getUserId(user);
    const role = getUserRole(user);

    if (!userId || !role) {
      disconnectSocket();
      return;
    }

    const token = localStorage.getItem("token");
    connectSocket(token)
      .then(() => joinRoom({ userId, role }))
      .catch((e) => console.warn("Socket reconnect failed", e));

    return () => {
      leaveRoom({ userId, role });
      disconnectSocket();
    };
  }, [user]);

  const login = async (userData) => {
    const normalizedUser = {
      token: userData.token,
      ...userData.user,
    };

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", userData.token);
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // leave socket room and disconnect
    try {
      leaveRoom({ userId: getUserId(user), role: getUserRole(user) });
      disconnectSocket();
    } catch {
      console.warn("Socket cleanup failed");
    }

    setUser(null);
  };

  const updateUser = (userData) => {
    const normalizedUser = {
      token: user?.token || localStorage.getItem("token"),
      ...userData,
    };

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
