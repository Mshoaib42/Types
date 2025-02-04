import { DataTypes, Optional } from "sequelize";
import sequelize from "../config/db";
import { Address, UserAttributes } from "../types/userTypes";
import BaseModel from "./BaseModel";

interface userCreationAttributes
  extends Optional<
    UserAttributes,
    "id" | "createdAt" | "updatedAt" | "deletedAt"
  > {}

class User
  extends BaseModel<UserAttributes, userCreationAttributes>
  implements UserAttributes
{
  id!: number;
  firstName!: string;
  lastName!: string;
  email?: string;
  password!: string;
  address?: Address;
  phone?: string;
  isActive?: boolean;
  isVerified?: boolean;
  otp?: string | null;
  role!: string;
  image?: string;
  isBlocked?: boolean;
  isApproved?: boolean;
  certificate?: string;
  qualificationVideo?: string;
  isMobileVerified: boolean = false;
  mobileOtp: string | null = null;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false, // Admin must approve mechanics
    },
    certificate: {
      type: DataTypes.STRING, // PDF File path
      allowNull: true,
    },
    qualificationVideo: {
      type: DataTypes.STRING, // Video File path
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false, //email verification
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false, //admin can block user
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, //email verification
    },

    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "user",
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    howUserHeardAboutUs: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isMobileVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false, //mobile verification
    },
    mobileOtp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    paranoid: true,
    tableName: "users",
    timestamps: true,
  }
);

export default User;
