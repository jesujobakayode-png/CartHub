import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { joinRoom, leaveRoom, connectSocket, disconnectSocket } from "../utils/socket";

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // connect and join room if user already logged in
    if (user) {
      const token = localStorage.getItem("token");
      connectSocket(token)
        .then(() => joinRoom({ userId: user.id, role: user.role }))
        .catch((e) => console.warn("Socket reconnect failed", e));
    }

    return () => {
      if (user) {
        leaveRoom({ userId: user.id, role: user.role });
      }
      disconnectSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (userData) => {
    const normalizedUser = {
      token: userData.token,
      ...userData.user,
    };

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", userData.token);
    setUser(normalizedUser);

    // connect socket and join appropriate room
    try {
      await connectSocket(normalizedUser.token);
      await joinRoom({ userId: normalizedUser.id, role: normalizedUser.role });
    } catch (e) {
      console.warn("Socket join failed", e);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // leave socket room and disconnect
    try {
      leaveRoom({ userId: user?.id, role: user?.role });
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
