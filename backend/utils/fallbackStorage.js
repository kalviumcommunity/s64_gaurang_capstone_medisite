// Shared fallback storage for when database is not available
const fallbackUsers = new Map();

const addUser = (user) => {
  fallbackUsers.set(user.email, user);
};

const getUserByEmail = (email) => {
  return fallbackUsers.get(email);
};

const getUserById = (id) => {
  return Array.from(fallbackUsers.values()).find(u => u.id === id);
};

const getAllUsers = () => {
  return Array.from(fallbackUsers.values());
};

const updateUser = (id, updates) => {
  const user = getUserById(id);
  if (user) {
    Object.assign(user, updates);
    fallbackUsers.set(user.email, user);
    return user;
  }
  return null;
};

const deleteUser = (id) => {
  const user = getUserById(id);
  if (user) {
    fallbackUsers.delete(user.email);
    return true;
  }
  return false;
};

module.exports = {
  addUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser
};
