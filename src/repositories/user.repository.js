import UserManager from '../dao/managers/UserManagerDb.js'; // Import your user manager

export default class UserRepository {
  constructor() {
    this.userManager = new UserManager();
  }

  async getUsers() {
    try {
      const users = await this.userManager.getAllUsers();
      return users.map(user => this.mapUserToDTO(user));
    } catch (error) {
      console.error(error);
      throw new Error('Error retrieving users: ' + error.message);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await this.userManager.getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      return this.mapUserToDTO(user);
    } catch (error) {
      console.error(error);
      throw new Error('Error retrieving user by email: ' + error.message);
    }
  }

  async changeUserRoleToPremium(userId) {
    try {
      const user = await this.userManager.getUserById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      const isEligible = this.userManager.checkPremiumEligibility(user);
      if (!isEligible) {
        throw new Error('User is not eligible to upgrade to premium');
      }

      await this.userManager.changeUserRoleToPremium(user);
      return {
        message: 'User role changed to premium',
        user: this.mapUserToDTO(user)
      };
    } catch (error) {
      console.error(error);
      throw new Error('Error changing user role: ' + error.message);
    }
  }

  async uploadFiles(userId, files) {
    try {
      const user = await this.userManager.getUserById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      const updatedUser = await this.userManager.uploadFiles(user, files);
      return { message: 'Files uploaded successfully', user: this.mapUserToDTO(updatedUser) };
    } catch (error) {
      console.error(error);
      throw new Error('Error uploading files: ' + error.message);
    }
  }

  async deleteInactiveUsers() {
    try {
      const deletedUsers = await this.userManager.deleteInactiveUsers();
      const deletedUserEmails = deletedUsers.map(user => user.email);

      // Send deletion emails to inactive users
      await this.sendDeletionEmails(deletedUserEmails);

      return { message: 'Inactive users have been deleted and emails sent.' };
    } catch (error) {
      console.error(error);
      throw new Error('Error deleting inactive users: ' + error.message);
    }
  }

  async deleteUser(userId) {
    try {
      const deletedUser = await this.userManager.deleteUser(userId);
      return { message: 'User deleted successfully', user: this.mapUserToDTO(deletedUser) };
    } catch (error) {
      console.error(error);
      throw new Error('Error deleting user: ' + error.message);
    }
  }

  async updateUserRole(userId, newRole) {
    try {
      const updatedUser = await this.userManager.updateUserRole(userId, newRole);
      return { message: 'User role updated successfully', user: this.mapUserToDTO(updatedUser) };
    } catch (error) {
      console.error(error);
      throw new Error('Error updating user role: ' + error.message);
    }
  }

  mapUserToDTO(user) {
    return {
      id: user._id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart,
      lastConnection: user.last_connection
    };
  }

  async sendDeletionEmails(userEmails) {
    try {
      const mailConfig = {
        service: 'gmail',
        auth: {
          user: config.mailing.user,
          pass: config.mailing.password
        }
      };

      const transport = nodemailer.createTransport(mailConfig);

      const deletionPromises = userEmails.map(async email => {
        const emailOptions = {
          from: `Coder Test <${config.mailing.user}>`,
          to: email,
          subject: 'Account Deletion Due to Inactivity',
          text: 'Your account has been deleted due to inactivity.'
        };

        await transport.sendMail(emailOptions);
      });

      await Promise.all(deletionPromises);
    } catch (error) {
      console.error('Error sending deletion emails:', error);
      throw new Error('Error sending deletion emails: ' + error.message);
    }
  }
}