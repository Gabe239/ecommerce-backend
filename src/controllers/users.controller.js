import UserRepository from '../repositories/user.repository.js';

const userRepository = new UserRepository();

export const getUsers = async (req, res) => {
  try {
    const users = await userRepository.getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await userRepository.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const changeUserRoleToPremium = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await userRepository.changeUserRoleToPremium(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const uploadFiles = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await userRepository.uploadFiles(userId, req.files);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteInactive = async (req, res) => {
  try {
    const result = await userRepository.deleteInactiveUsers();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await userRepository.deleteUser(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    const result = await userRepository.updateUserRole(userId, role);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};