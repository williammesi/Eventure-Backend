import sequelize from '../core/database.js';

import User from './User.js';
import Role from './Role.js';
import SecretQuestion from './SecretQuestion.js';
import Category from './Category.js';
import Location from './Location.js';
import Client from './Client.js';
import Organisation from './Organisation.js';
import Event from './Event.js';
import Image from './Image.js';
import NotificationType from './NotificationType.js';
import Notification from './Notification.js';
import Survey from './Survey.js';
import SurveyChoice from './SurveyChoice.js';
import SurveyAnswer from './SurveyAnswer.js';
import Thread from './Thread.js';
import ThreadAnswer from './ThreadAnswer.js';
import FollowedEvent from './FollowedEvent.js';
import FollowedOrganisation from './FollowedOrganisation.js';

User.belongsTo(Role, { foreignKey: 'RoleID' });
Role.hasMany(User, { foreignKey: 'RoleID' });

User.belongsTo(SecretQuestion, { foreignKey: 'SecretQuestionID' });
SecretQuestion.hasMany(User, { foreignKey: 'SecretQuestionID' });

Client.belongsTo(User, { foreignKey: 'UserID' });
User.hasOne(Client, { foreignKey: 'UserID' });

Organisation.belongsTo(User, { foreignKey: 'UserID' });
User.hasOne(Organisation, { foreignKey: 'UserID' });

Event.belongsTo(User, { foreignKey: 'UserID' });
User.hasMany(Event, { foreignKey: 'UserID' });

Event.belongsTo(Location, { foreignKey: 'LocationID' });
Location.hasMany(Event, { foreignKey: 'LocationID' });

Event.belongsTo(Category, { foreignKey: 'CategoryID' });
Category.hasMany(Event, { foreignKey: 'CategoryID' });

Image.belongsTo(Event, { foreignKey: 'EventID' });
Event.hasMany(Image, { foreignKey: 'EventID' });

Notification.belongsTo(NotificationType, { foreignKey: 'TypeID' });
NotificationType.hasMany(Notification, { foreignKey: 'TypeID' });

Notification.belongsTo(User, { foreignKey: 'UserID', as: 'Recipient' });
User.hasMany(Notification, { foreignKey: 'UserID', as: 'ReceivedNotifications' });

Notification.belongsTo(User, { foreignKey: 'SenderID', as: 'Sender' });
User.hasMany(Notification, { foreignKey: 'SenderID', as: 'SentNotifications' });

Survey.belongsTo(User, { foreignKey: 'UserID' });
User.hasMany(Survey, { foreignKey: 'UserID' });

Survey.belongsTo(Category, { foreignKey: 'CategoryID' });
Category.hasMany(Survey, { foreignKey: 'CategoryID' });

SurveyChoice.belongsTo(Survey, { foreignKey: 'SurveyID' });
Survey.hasMany(SurveyChoice, { foreignKey: 'SurveyID' });

SurveyAnswer.belongsTo(User, { foreignKey: 'UserID' });
SurveyAnswer.belongsTo(Survey, { foreignKey: 'SurveyID' });
SurveyAnswer.belongsTo(SurveyChoice, { foreignKey: 'SurveyChoiceID' });

Thread.belongsTo(Event, { foreignKey: 'EventID' });
Event.hasMany(Thread, { foreignKey: 'EventID' });

Thread.belongsTo(User, { foreignKey: 'UserID' });
User.hasMany(Thread, { foreignKey: 'UserID' });

ThreadAnswer.belongsTo(Thread, { foreignKey: 'ThreadID' });
Thread.hasMany(ThreadAnswer, { foreignKey: 'ThreadID' });

ThreadAnswer.belongsTo(User, { foreignKey: 'UserID' });
User.hasMany(ThreadAnswer, { foreignKey: 'UserID' });

FollowedEvent.belongsTo(Event, { foreignKey: 'EventID' });
FollowedEvent.belongsTo(User, { foreignKey: 'UserID' });

FollowedOrganisation.belongsTo(User, { foreignKey: 'OrganisationID', as: 'Organisation' });
FollowedOrganisation.belongsTo(User, { foreignKey: 'UserID', as: 'Follower' });

Organisation.belongsTo(User, {
  foreignKey: 'UserID',
  as: 'user'
});

export {
  sequelize,
  User,
  Role,
  SecretQuestion,
  Category,
  Location,
  Client,
  Organisation,
  Event,
  Image,
  NotificationType,
  Notification,
  Survey,
  SurveyChoice,
  SurveyAnswer,
  Thread,
  ThreadAnswer,
  FollowedEvent,
  FollowedOrganisation
};