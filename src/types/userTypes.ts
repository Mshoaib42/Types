export interface Address {
  address?: string;
  apartmentSuite?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  password: string;
  address?: Address;
  phone?: string;
  isActive?: boolean;
  role: string;
  isVerified?: boolean;
  otp?: string | null;
  image?: string;
  isBlocked?: boolean;
  isApproved?: boolean;
  certificate?: string;
  qualificationVideo?: string;
  isMobileVerified: boolean;
  mobileOtp?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

// get all users response types
// export interface UserDataValues {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   address: Address;
//   phone: string;
//   isActive: boolean;
//   role: string;
//   image: string | null;
//   createdAt: Date;
//   updatedAt: Date;
//   deletedAt: Date | null;
// }

// export interface UserOptions {
//   isNewRecord: boolean;
//   _schema: string | null;
//   _schemaDelimiter: string;
//   raw: boolean;
//   attributes: string[];
// }

// export interface usersResponseTypes {
//   dataValues: UserDataValues;
//   _previousDataValues: UserDataValues;
//   uniqno: number;
//   _changed: Set<string>;
//   _options: UserOptions;
//   isNewRecord: boolean;
// }
