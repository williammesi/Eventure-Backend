import crypto from "crypto";
import jwt from "jsonwebtoken";
import HttpErrors from "http-errors";
import argon from "argon2";
import parseDuration from "parse-duration";
import { Op } from "sequelize";

import clientRepository from "./client.repository.js";
import organisationRepository from "./organisation.repository.js";

import User from "../models/User.js";
import CertificationRequest from "../models/CertificationRequest.js";

class UserRepository {
  async login(credential, password) {
    const user = await this.retrieveByCredentials(credential);
    if (!user) {
      //Email ou Username non présent en base de données
      throw HttpErrors.Unauthorized();
    }

    if (!(await this.validatePassword(password, user))) {
      throw HttpErrors.Unauthorized();
    }

    return user;
  }

  async validatePassword(password, user) {
    return await argon.verify(user.Password, password);
  }


  async retrieveByUsernameEmail(username, email) {
    try{

      const user = await User.findOne({
      where: {
        [Op.and]: [{ Username: username }, { Email: email }],
      },
    });

    return user;

    } catch (err) {
      console.error("Error in retrieveByUsernameEmail:", err);
      throw err;
    }
  }

  async create(user) {
    try {
      console.log("Payload reçu dans repository:", user);

      // 1. Check if username already exists
      const existingUsername = await User.findOne({
        where: { Username: user.Username }
      });

      if (existingUsername) {
        throw HttpErrors.Conflict('Ce nom d\'utilisateur est déjà utilisé');
      }

      // 2. Check if email already exists
      const existingEmail = await User.findOne({
        where: { Email: user.Email }
      });

      if (existingEmail) {
        throw HttpErrors.Conflict('Cet email est déjà utilisé');
      }

      // 3. Hash password
      const passwordHash = await argon.hash(user.Password);
      user.Password = passwordHash;

      console.log("Objet envoyé à Sequelize:", user);

      // 4. Create user record
      const createdUser = await User.create(user);

      // 5. Create profile based on role
      switch (createdUser.RoleID) {
        case 1: // Client
          await clientRepository.create({
            UserID: createdUser.ID,
            FirstName: user.FirstName,
            LastName: user.LastName,
            DateOfBirth: user.DateOfBirth,
          });
          break;

        case 2: // Organisation
          await organisationRepository.create({
            UserID: createdUser.ID,
            Name: user.Name,
            PhoneNumber: user.PhoneNumber,
            Certified: false, // Default value
          });

          // Create certification request for the organisation
          await CertificationRequest.create({
            TargetType: 'user',
            TargetID: createdUser.ID,
            Status: 'Pending'
          });
          break;

        default:
          // Admin or other role - no profile needed
          break;
      }

      // 6. Return the user (not the profile)
      return createdUser;
    } catch (err) {
      console.error("Error in user repository create:", err);
      throw err;
    }
  }

  async retrieveById(id) {
    return User.findByPk(id);
  }

  async retrieveAll() {
    return User.findAll();
  }

  retrieveByCredentials(credential) {
    return User.findOne({
      where: {
        [Op.or]: [{ Email: credential }, { Username: credential }],
      },
    });
  }

  async updatePassword(userId, newPassword) {
    try {
      const user = await this.retrieveById(userId);
      if (!user) {
        throw HttpErrors.NotFound('Utilisateur non trouvé');
      }

      // Hash the new password
      const passwordHash = await argon.hash(newPassword);

      // Update user password
      await user.update({
        Password: passwordHash
      });

      return user;
    } catch (err) {
      console.error("Error in updatePassword:", err);
      throw err;
    }
  }

  async search(query) {
    try {
      if (!query || query.trim().length === 0) {
        return [];
      }

      const searchPattern = `%${query}%`;

      // Search in User table (Username, Email)
      const users = await User.findAll({
        where: {
          [Op.or]: [
            { Username: { [Op.like]: searchPattern } },
            { Email: { [Op.like]: searchPattern } }
          ]
        }
      });

      // Search in Client table (FirstName, LastName)
      const clients = await clientRepository.searchByName(searchPattern);

      // Search in Organisation table (Name)
      const organisations = await organisationRepository.searchByName(searchPattern);

      // Combine all matching user IDs
      const userIds = new Set([
        ...users.map(u => u.ID),
        ...clients.map(c => c.UserID),
        ...organisations.map(o => o.UserID)
      ]);

      // Fetch and transform all matching users
      const matchedUsers = await User.findAll({
        where: { ID: Array.from(userIds) }
      });

      return await Promise.all(
        matchedUsers.map(u => this.transform(u.toJSON()))
      );
    } catch (err) {
      console.error("Error in search:", err);
      throw err;
    }
  }

  async updateOrganisation(userId, updates) {
  try {
    const user = await this.retrieveById(userId);
    if (!user) {
      throw HttpErrors.NotFound('Utilisateur non trouvé');
    }
    if (user.RoleID !== 2) {
      throw HttpErrors.Forbidden('L\'utilisateur n\'est pas une organisation');
    }

    const organisation = await organisationRepository.findByUserId(userId);
    if (!organisation) {
      throw HttpErrors.NotFound('Profil organisation non trouvé');
    }

    const userUpdateData = {};
    
    if (updates.username !== undefined && updates.username !== user.Username) {
      const existingUser = await User.findOne({
        where: {
          Username: updates.username,
          ID: { [Op.ne]: userId }
        }
      });
      
      if (existingUser) {
        throw HttpErrors.Conflict('Ce nom d\'utilisateur est déjà utilisé');
      }
      
      userUpdateData.Username = updates.username;
    }
    
    if (updates.email !== undefined && updates.email !== user.Email) {
      const existingUser = await User.findOne({
        where: {
          Email: updates.email,
          ID: { [Op.ne]: userId }
        }
      });
      
      if (existingUser) {
        throw HttpErrors.Conflict('Cet email est déjà utilisé');
      }
      
      userUpdateData.Email = updates.email;
    }

    if (Object.keys(userUpdateData).length > 0) {
      await user.update(userUpdateData);
    }

    const organisationUpdateData = {};
    
    if (updates.organisationName !== undefined) {
      organisationUpdateData.Name = updates.organisationName;
    }
    
    if (updates.phoneNumber !== undefined) {
      organisationUpdateData.PhoneNumber = updates.phoneNumber;
    }

    if (Object.keys(organisationUpdateData).length > 0) {
      await organisation.update(organisationUpdateData);
    }

    const updatedUser = await this.retrieveById(userId);
    return await this.transform(updatedUser);

  } catch (err) {
    console.error("Error in user repository updateOrganisation:", err);
    throw err;
  }
}

  async banUser(userId, bannedUntil) {
    try {
      const user = await this.retrieveById(userId);
      if (!user) {
        throw HttpErrors.NotFound('Utilisateur non trouvé');
      }

      // Update user's BannedUntil field
      await user.update({
        BannedUntil: bannedUntil
      });

      return user;
    } catch (err) {
      console.error("Error in banUser:", err);
      throw err;
    }
  }

  async unbanUser(userId) {
    try {
      const user = await this.retrieveById(userId);
      if (!user) {
        throw HttpErrors.NotFound('Utilisateur non trouvé');
      }

      // Reset BannedUntil to default value
      await user.update({
        BannedUntil: "1970-01-01"
      });

      return user;
    } catch (err) {
      console.error("Error in unbanUser:", err);
      throw err;
    }
  }

  generateJWT(userId, roleId) {
    const access = jwt.sign(
        { 
            userId: userId,  // ou uuid: userId si vous préférez
            roleId: roleId 
        }, 
        process.env.JWT_TOKEN_SECRET, 
        {
            expiresIn: process.env.JWT_TOKEN_LIFE,
            issuer: process.env.BASE_URL,
        }
    );
    const refresh = jwt.sign(
        { 
            userId: userId,
            roleId: roleId 
        }, 
        process.env.JWT_REFRESH_SECRET, 
        {
            expiresIn: process.env.JWT_REFRESH_LIFE,
            issuer: process.env.BASE_URL,
        }
    );
    const expiresIn = parseDuration(process.env.JWT_TOKEN_LIFE);

    return { access, refresh, expiresIn };
}

  async validateRefreshToken(email, headerBase64) {
    //TODO:
  }

  async transform(user) {
    user.href = `${process.env.BASE_URL}/users/${user.ID}`;


    switch (user.RoleID) {
      case 1:
        user.Role = "Client";
        const client = await clientRepository.findByUserId(user.ID);
        if (client) {
          user.Client = {
            FirstName: client.FirstName,
            LastName: client.LastName,
            DateOfBirth: client.DateOfBirth,
          };
        }
        break;
      case 2:
        user.Role = "Organisation";
        const organisation = await organisationRepository.findByUserId(user.ID);
        if (organisation) {
          user.Organisation = {
            Name: organisation.Name,
          Certified: organisation.Certified,
          PhoneNumber: organisation.PhoneNumber,
        };
      }
    }

    delete user._id;
    delete user.__v;
    delete user.uuid;
    delete user.Password;

    return user;
  }
}

export default new UserRepository();
