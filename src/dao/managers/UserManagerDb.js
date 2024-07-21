import User from '../models/userModel.js';

class UserManager {
  constructor() {}

  async addUser(firstName, lastName, email, age, password, role = 'user', documents = [], lastConnection = null) {
    try {
      const existingUser = await User.findOne({ email }).lean();
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const newUser = new User({
        first_name: firstName,
        last_name: lastName,
        email,
        age,
        password,
        role,
        documents,
        last_connection: lastConnection,
      });

      await newUser.save();

      console.log('User has been successfully added.');
    } catch (err) {
      throw new Error('Error adding user: ' + err.message);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email })
      console.log(user)
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      throw new Error('Error getting user by email: ' + err.message);
    }
  }


  async updateUser(firstName, lastName, email, age, password, role, documents, lastConnection, id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      user.first_name = firstName;
      user.last_name = lastName;
      user.email = email;
      user.age = age;
      user.password = password;
      user.role = role;
      user.documents = documents;
      user.last_connection = lastConnection;

      await user.save();

      console.log('User has been updated successfully.');
    } catch (err) {
      throw new Error('Error updating user: ' + err.message);
    }
  }

  async deleteUser(id) {
    try {
      const user = await User.findByIdAndRemove(id);
      if (!user) {
        throw new Error('User not found');
      }
      console.log('User has been deleted successfully.');
    } catch (err) {
      throw new Error('Error deleting user: ' + err.message);
    }
  }
}

export default UserManager;
