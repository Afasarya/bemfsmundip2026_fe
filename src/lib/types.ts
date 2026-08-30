// Shared domain types — mirror the backend response DTOs exactly.

export type ID = string;

export type MediaRef = {
  id: ID;
  url: string;
  alt?: string | null;
};

export type ArticleStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "SCHEDULED"
  | "PUBLISHED"
  | "ARCHIVED";

export type ArticleVisibility = "PUBLIC" | "INTERNAL";

export type UnitType = "TEAM" | "BUREAU" | "DIVISION";
export type UnitStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type UnitProgramStatus = "PLANNED" | "ACTIVE" | "COMPLETED";

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  TEAM: "Tim",
  BUREAU: "Biro",
  DIVISION: "Bidang",
};

// Article response (matches ArticleResponseDto exactly).
export type Article = {
  id: ID;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverMediaId: string | null;
  coverUrl: string | null;
  coverWidth: number | null;
  coverHeight: number | null;
  categoryId: string | null;
  authorId: string | null;
  status: ArticleStatus;
  visibility: ArticleVisibility;
  isFeatured: boolean;
  coverAlt: string | null;
  wordCount: number;
  readingMinutes: number;
  publishedAt: string | null;
  scheduledAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedArticles = {
  data: Article[];
  total: number;
  page: number;
  pageSize: number;
};

// Editor support types — mirror backend response shapes.

export type ArticleCategory = {
  id: ID;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
};

export type ArticleRevision = {
  id: ID;
  articleId: ID;
  version: number;
  createdAt: string;
  createdBy: { id: ID; name: string; email: string } | null;
  restoreSourceId: string | null;
};

export type MediaVariant = "cover" | "inline" | "avatar" | "gallery";

export type Media = {
  id: ID;
  url: string;
  alt: string | null;
  mimeType: string;
  width: number | null;
  height: number | null;
  sizeBytes: number;
  variant: MediaVariant;
  createdAt: string;
};

export type CreateArticleInput = {
  title: string;
  excerpt?: string;
  content: string;
  coverMediaId?: string;
  categoryId?: string;
  visibility?: ArticleVisibility;
  coverAlt?: string;
};

export type UpdateArticleInput = Partial<CreateArticleInput> & {
  scheduledAt?: string;
};

// Unit list item (matches UnitListItemDto exactly).
export type UnitListItem = {
  id: ID;
  slug: string;
  name: string;
  shortName: string | null;
  type: UnitType;
  summary: string | null;
  logo: { id: string; url: string } | null;
  status: UnitStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type UnitStrategy = {
  id: ID;
  content: string;
  sortOrder: number;
};

export type UnitProgram = {
  id: ID;
  name: string;
  description: string | null;
  scheduleLabel: string | null;
  externalUrl: string | null;
  status: UnitProgramStatus;
  sortOrder: number;
};

export type UnitMember = {
  id: ID;
  name: string;
  role: string;
  photoMediaId: string | null;
  photo: { id: string; url: string; alt: string | null } | null;
  photoAlt: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type UnitDetail = {
  id: ID;
  slug: string;
  name: string;
  shortName: string | null;
  type: UnitType;
  logoMediaId: string | null;
  logo: { id: string; url: string } | null;
  summary: string | null;
  description: string | null;
  status: UnitStatus;
  sortOrder: number;
  seoTitle: string | null;
  seoDesc: string | null;
  strategies: UnitStrategy[];
  programs: UnitProgram[];
  members: UnitMember[];
  createdAt: string;
  updatedAt: string;
};

// Instagram — matches InstagramProfileResponse exactly.
export type InstagramProfileData = {
  id: string;
  handle: string;
  bio: string | null;
  profilePictureUrl: string | null;
  profileMedia: MediaRef | null;
  followerCount: number | null;
  followingCount: number | null;
  postCount: number | null;
  latestPostUrl: string | null;
  latestPostImageUrl: string | null;
  latestPostCaption: string | null;
  latestPostDate: string | null;
  latestPostMedia: MediaRef | null;
  lastSyncedAt: string | null;
  updatedAt: string;
};

// Dashboard responses.
export type PublicDashboard = {
  articles: number;
  media: number;
};

export type AdminDashboard = {
  articles: Record<ArticleStatus | "total", number>;
  media: { count: number; totalSizeBytes: number };
  organization: {
    published: number;
    draft: number;
    archived: number;
    total: number;
  };
  recentArticles: {
    id: ID;
    title: string;
    slug: string;
    status: ArticleStatus;
    publishedAt: string | null;
  }[];
  recentUsers: {
    id: ID;
    name: string;
    email: string;
    roleCode: string;
    createdAt: string;
  }[];
};

export type ApiError = {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
};

// ============================================================
// Organization units (admin CRUD)
// ============================================================

export type UnitStrategyInput = {
  id?: string;
  content: string;
  sortOrder: number;
};

export type UnitProgramInput = {
  id?: string;
  name: string;
  description?: string | null;
  scheduleLabel?: string | null;
  externalUrl?: string | null;
  status?: UnitProgramStatus;
  sortOrder: number;
};

export type UnitMemberInput = {
  id?: string;
  name: string;
  role: string;
  photoMediaId?: string | null;
  photoAlt?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  sortOrder: number;
  isActive?: boolean;
};

export type CreateUnitInput = {
  name: string;
  slug: string;
  shortName?: string;
  type: UnitType;
  logoMediaId?: string;
  summary?: string;
  description?: string;
  status?: UnitStatus;
  sortOrder?: number;
  seoTitle?: string;
  seoDesc?: string;
  strategies?: UnitStrategyInput[];
  programs?: UnitProgramInput[];
  members?: UnitMemberInput[];
};

export type UpdateUnitInput = Partial<CreateUnitInput>;

export type UnitListResponse = {
  data: UnitListItem[];
  total: number;
  page: number;
  pageSize: number;
};

// ============================================================
// Instagram posts (admin CRUD)
// ============================================================

export type InstagramPlacementType = "HOME" | "INFORMATION";
export type InstagramPostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type InstagramContentType = "POST" | "REEL" | "CAROUSEL";

export type InstagramPlacement = {
  id: string;
  placement: InstagramPlacementType;
  isHighlighted: boolean;
  sortOrder: number;
};

export type InstagramPostListItem = {
  id: string;
  canonicalUrl: string;
  shortcode: string;
  internalTitle: string | null;
  contentType: InstagramContentType;
  status: InstagramPostStatus;
  placements: InstagramPlacement[];
  createdAt: string;
  updatedAt: string;
};

export type InstagramPost = InstagramPostListItem & {
  internalNote: string | null;
};

export type InstagramPostListResponse = {
  data: InstagramPostListItem[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateInstagramPostInput = {
  title: string;
  canonicalUrl: string;
  status?: InstagramPostStatus;
};

export type UpdateInstagramPostInput = Partial<CreateInstagramPostInput> & {
  internalNote?: string;
};

// ============================================================
// Article categories (admin CRUD)
// ============================================================

export type CreateCategoryInput = {
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

// ============================================================
// Auth
// ============================================================

export type UserRoleCode =
  | "SUPER_ADMIN"
  | "EDITOR"
  | "ADMIN_BIDANG";

export type UserStatus = "ACTIVE" | "PENDING_INVITATION" | "SUSPENDED";

export type AuthUser = {
  id: ID;
  email: string;
  name: string;
  roleCode: UserRoleCode;
};

export type LoginResponse = AuthUser & {
  accessToken: string;
};

export type MeResponse = AuthUser & {
  status: UserStatus;
  permissions: string[];
  unitScopes: { unitId: ID; role: string }[];
};