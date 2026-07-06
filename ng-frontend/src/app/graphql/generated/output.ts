/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: unknown; output: unknown; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: unknown; output: unknown; }
};

export type AuthModel = {
  __typename?: 'AuthModel';
  message?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserModel>;
};

export type CategoryModel = {
  __typename?: 'CategoryModel';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  slug: Scalars['String']['output'];
  streams: Array<StreamModel>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ChangeChatSettingsInput = {
  isChatEnabled: Scalars['Boolean']['input'];
  isChatFollowersOnly: Scalars['Boolean']['input'];
  isChatSponsorsOnly: Scalars['Boolean']['input'];
};

export type ChangeEmailInput = {
  email: Scalars['String']['input'];
};

export type ChangeNotificationSettingsInput = {
  siteNotifications: Scalars['Boolean']['input'];
  telegramNotifications: Scalars['Boolean']['input'];
};

export type ChangeNotificationSettingsResponse = {
  __typename?: 'ChangeNotificationSettingsResponse';
  notificationSettings: NotificationSettingsModel;
  telegramAuthToken?: Maybe<Scalars['String']['output']>;
};

export type ChangePasswordInput = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type ChangeProfileInfoInput = {
  bio: Scalars['String']['input'];
  displayName: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type ChangeStreamInfoInput = {
  categoryId: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type ChatMessageModel = {
  __typename?: 'ChatMessageModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  stream: StreamModel;
  streamId: Scalars['String']['output'];
  text: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: UserModel;
  userId: Scalars['String']['output'];
};

export type CreatePlanInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
  title: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type DeactivateAccountInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  pin?: InputMaybe<Scalars['String']['input']>;
};

export type DeviceModel = {
  __typename?: 'DeviceModel';
  browser: Scalars['String']['output'];
  os: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type EnableTotpInput = {
  pin: Scalars['String']['input'];
  secret: Scalars['String']['input'];
};

export type FiltersInput = {
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Float']['input']>;
  take?: InputMaybe<Scalars['Float']['input']>;
};

export type FollowModel = {
  __typename?: 'FollowModel';
  createdAt: Scalars['DateTime']['output'];
  follower: UserModel;
  followerId: Scalars['String']['output'];
  following: UserModel;
  followingId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GenerateStreamTokenInput = {
  channelId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type GeneratedTokenModel = {
  __typename?: 'GeneratedTokenModel';
  token: Scalars['String']['output'];
};

export type LocationModel = {
  __typename?: 'LocationModel';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitute: Scalars['Float']['output'];
};

export type LoginInput = {
  login: Scalars['String']['input'];
  password: Scalars['String']['input'];
  pin?: InputMaybe<Scalars['String']['input']>;
};

export type MakePaymentModel = {
  __typename?: 'MakePaymentModel';
  url: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changeChatSettings: Scalars['Boolean']['output'];
  changeEmail: Scalars['Boolean']['output'];
  changeNotificationsSettings: ChangeNotificationSettingsResponse;
  changePassword: Scalars['Boolean']['output'];
  changeProfileAvatar: Scalars['Boolean']['output'];
  changeProfileInfo: Scalars['Boolean']['output'];
  changeStreamInfo: Scalars['Boolean']['output'];
  changeStreamThumbnail: Scalars['Boolean']['output'];
  clearSessionCookie: Scalars['Boolean']['output'];
  createIngress: Scalars['Boolean']['output'];
  createSocialLink: Scalars['Boolean']['output'];
  createSponsorshipPlan: Scalars['Boolean']['output'];
  createUser: Scalars['Boolean']['output'];
  deactivateAccount: AuthModel;
  disableTotp: Scalars['Boolean']['output'];
  enableTotp: Scalars['Boolean']['output'];
  followChannel: Scalars['Boolean']['output'];
  generateStreamToken: GeneratedTokenModel;
  loginUser: AuthModel;
  logoutUser: Scalars['Boolean']['output'];
  makePayment: MakePaymentModel;
  removeProfileAvatar: Scalars['Boolean']['output'];
  removeSession: Scalars['Boolean']['output'];
  removeSocialLink: Scalars['Boolean']['output'];
  removeSponsorshipPlan: Scalars['Boolean']['output'];
  removeStreamThumbnail: Scalars['Boolean']['output'];
  reorderSocialLinks: Scalars['Boolean']['output'];
  resetPassword: Scalars['Boolean']['output'];
  sendChatMessage: ChatMessageModel;
  setNewPassword: Scalars['Boolean']['output'];
  unfollowChannel: Scalars['Boolean']['output'];
  updateSocialLink: Scalars['Boolean']['output'];
  verifyAccount: AuthModel;
};


export type MutationChangeChatSettingsArgs = {
  data: ChangeChatSettingsInput;
};


export type MutationChangeEmailArgs = {
  data: ChangeEmailInput;
};


export type MutationChangeNotificationsSettingsArgs = {
  data: ChangeNotificationSettingsInput;
};


export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};


export type MutationChangeProfileAvatarArgs = {
  avatar: Scalars['Upload']['input'];
};


export type MutationChangeProfileInfoArgs = {
  data: ChangeProfileInfoInput;
};


export type MutationChangeStreamInfoArgs = {
  data: ChangeStreamInfoInput;
};


export type MutationChangeStreamThumbnailArgs = {
  thumbnail: Scalars['Upload']['input'];
};


export type MutationCreateIngressArgs = {
  ingressType: Scalars['Float']['input'];
};


export type MutationCreateSocialLinkArgs = {
  data: SocialLinkInput;
};


export type MutationCreateSponsorshipPlanArgs = {
  data: CreatePlanInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationDeactivateAccountArgs = {
  data: DeactivateAccountInput;
};


export type MutationEnableTotpArgs = {
  data: EnableTotpInput;
};


export type MutationFollowChannelArgs = {
  channelId: Scalars['String']['input'];
};


export type MutationGenerateStreamTokenArgs = {
  data: GenerateStreamTokenInput;
};


export type MutationLoginUserArgs = {
  data: LoginInput;
};


export type MutationMakePaymentArgs = {
  planId: Scalars['String']['input'];
};


export type MutationRemoveSessionArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveSocialLinkArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveSponsorshipPlanArgs = {
  planId: Scalars['String']['input'];
};


export type MutationReorderSocialLinksArgs = {
  list: Array<SocialLinksOrderInput>;
};


export type MutationResetPasswordArgs = {
  data: ResetPasswordInput;
};


export type MutationSendChatMessageArgs = {
  data: SendMessageInput;
};


export type MutationSetNewPasswordArgs = {
  data: NewPasswordInput;
};


export type MutationUnfollowChannelArgs = {
  channelId: Scalars['String']['input'];
};


export type MutationUpdateSocialLinkArgs = {
  data: SocialLinkInput;
  id: Scalars['String']['input'];
};


export type MutationVerifyAccountArgs = {
  data: VerificationInput;
};

export type NewPasswordInput = {
  password: Scalars['String']['input'];
  passwordConfirm: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type NotificationModel = {
  __typename?: 'NotificationModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isRead: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  type: NotificationType;
  updatedAt: Scalars['DateTime']['output'];
  user: UserModel;
  userId: Scalars['String']['output'];
};

export type NotificationSettingsModel = {
  __typename?: 'NotificationSettingsModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  siteNotifications: Scalars['Boolean']['output'];
  telegramNotifications: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: UserModel;
  userId: Scalars['String']['output'];
};

export enum NotificationType {
  EnableTwoFactor = 'ENABLE_TWO_FACTOR',
  NewFollower = 'NEW_FOLLOWER',
  NewSponsorship = 'NEW_SPONSORSHIP',
  StreamStart = 'STREAM_START',
  VerifiedChannel = 'VERIFIED_CHANNEL'
}

export type PlanModel = {
  __typename?: 'PlanModel';
  channel: UserModel;
  channelId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  price: Scalars['Float']['output'];
  stripePlanId: Scalars['String']['output'];
  stripeProductId: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  findMessagesByStream: Array<ChatMessageModel>;
  generateTotpSecret: TotpModel;
  getAllStreams: Array<StreamModel>;
  getCategories: Array<CategoryModel>;
  getCategoryBySlug: CategoryModel;
  getChannelByUsername: UserModel;
  getCurrentSession: SessionModel;
  getFollowersCountByChannel: Scalars['Float']['output'];
  getMe: UserModel;
  getMyFollowers: Array<FollowModel>;
  getMySponsors: Array<SubscriptionModel>;
  getMySponsorshipPlans: Array<PlanModel>;
  getMyTransactions: Array<TransactionModel>;
  getMyfollowings: Array<FollowModel>;
  getNotificationsByUser: Array<NotificationModel>;
  getRandomCategories: Array<CategoryModel>;
  getRandomStreams: Array<StreamModel>;
  getRecommendedChannels: Array<UserModel>;
  getSessionsByUser: Array<SessionModel>;
  getSocialLinks: Array<SocialLinkModel>;
  getSponsorsByChannel: Array<SubscriptionModel>;
  getUnreadNotificationsCount: Scalars['Float']['output'];
};


export type QueryFindMessagesByStreamArgs = {
  streamId: Scalars['String']['input'];
};


export type QueryGetAllStreamsArgs = {
  filters: FiltersInput;
};


export type QueryGetCategoryBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryGetChannelByUsernameArgs = {
  username: Scalars['String']['input'];
};


export type QueryGetFollowersCountByChannelArgs = {
  channelId: Scalars['String']['input'];
};


export type QueryGetSponsorsByChannelArgs = {
  channelId: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  email: Scalars['String']['input'];
};

export type SendMessageInput = {
  streamId: Scalars['String']['input'];
  text: Scalars['String']['input'];
};

export type SessionMetadataModel = {
  __typename?: 'SessionMetadataModel';
  device: DeviceModel;
  ip: Scalars['String']['output'];
  location: LocationModel;
};

export type SessionModel = {
  __typename?: 'SessionModel';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  metadata: SessionMetadataModel;
  userId: Scalars['String']['output'];
};

export type SocialLinkInput = {
  title: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type SocialLinkModel = {
  __typename?: 'SocialLinkModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  position: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type SocialLinksOrderInput = {
  id: Scalars['String']['input'];
  position: Scalars['Float']['input'];
};

export type StreamModel = {
  __typename?: 'StreamModel';
  category: CategoryModel;
  categoryId: Scalars['String']['output'];
  chatMessages: Array<ChatMessageModel>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  ingressId?: Maybe<Scalars['String']['output']>;
  isChatEnabled: Scalars['Boolean']['output'];
  isChatFollowersOnly: Scalars['Boolean']['output'];
  isChatSponsorsOnly: Scalars['Boolean']['output'];
  isLive: Scalars['Boolean']['output'];
  serverUrl?: Maybe<Scalars['String']['output']>;
  streamKey?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: UserModel;
  userId: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  chatMessageAdded: ChatMessageModel;
};


export type SubscriptionChatMessageAddedArgs = {
  streamId: Scalars['String']['input'];
};

export type SubscriptionModel = {
  __typename?: 'SubscriptionModel';
  channel: UserModel;
  channelId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  plan: PlanModel;
  planId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: UserModel;
  userId: Scalars['String']['output'];
};

export type TotpModel = {
  __typename?: 'TotpModel';
  qrCodeUrl: Scalars['String']['output'];
  secret: Scalars['String']['output'];
};

export type TransactionModel = {
  __typename?: 'TransactionModel';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  status: TransactionStatus;
  stripeSubscriptionId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: UserModel;
  userId: Scalars['String']['output'];
};

export enum TransactionStatus {
  Expired = 'EXPIRED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Success = 'SUCCESS'
}

export type UserModel = {
  __typename?: 'UserModel';
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deactivatedAt?: Maybe<Scalars['DateTime']['output']>;
  displayName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  followers: Array<FollowModel>;
  followings: Array<FollowModel>;
  id: Scalars['ID']['output'];
  isDeactivated: Scalars['Boolean']['output'];
  isEmailVerified: Scalars['Boolean']['output'];
  isTotpEnabled: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  notificationSettings: NotificationSettingsModel;
  notifications: Array<NotificationModel>;
  password: Scalars['String']['output'];
  socialLinks: Array<SocialLinkModel>;
  stream: StreamModel;
  telegramId?: Maybe<Scalars['String']['output']>;
  totpSecret?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type VerificationInput = {
  token: Scalars['String']['input'];
};

export type GetChannelByUsernameQueryVariables = Exact<{
  username: string;
}>;


export type GetChannelByUsernameQuery = { getChannelByUsername: { username: string, email: string, stream: { title: string, thumbnail: string | null, isLive: boolean } } };

export const GetChannelByUsernameDocument = gql`
    query GetChannelByUsername($username: String!) {
  getChannelByUsername(username: $username) {
    username
    email
    stream {
      title
      thumbnail
      isLive
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetChannelByUsernameGQL extends Apollo.Query<GetChannelByUsernameQuery, GetChannelByUsernameQueryVariables> {
    document = GetChannelByUsernameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }