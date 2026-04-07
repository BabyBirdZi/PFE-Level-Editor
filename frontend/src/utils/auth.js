export function getStoredUser() {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  return {
    username,
    email,
    token,
    isLoggedIn: !!token,
  };
}

export function clearStoredUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
}

export function getUserInitials() {
  const { username, email } = getStoredUser();

  if (username && username.trim()) {
    const parts = username.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return username.slice(0, 2).toUpperCase();
  }

  if (email && email.trim()) {
    return email.slice(0, 2).toUpperCase();
  }

  return "U";
}