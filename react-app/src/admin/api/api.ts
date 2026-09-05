/* ── профиль ─────────────────────────────────────── */

export const ADMIN_PROFILE_QUERY = `
  query AdminProfile {
    profile { id name headline description location email }
  }
`;

export const UPDATE_PROFILE_MUTATION = `
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) { id name headline description location email }
  }
`;

/* ── навыки ──────────────────────────────────────── */

export const ADMIN_SKILLS_QUERY = `
  query AdminSkills {
    profile { id skills { id name category level order } }
  }
`;

export const CREATE_SKILL_MUTATION = `
  mutation CreateSkill($input: CreateSkillInput!) {
    createSkill(input: $input) { id name category level order }
  }
`;

export const UPDATE_SKILL_MUTATION = `
  mutation UpdateSkill($input: UpdateSkillInput!) {
    updateSkill(input: $input) { id name category level order }
  }
`;

export const DELETE_SKILL_MUTATION = `
  mutation DeleteSkill($id: ID!) { deleteSkill(id: $id) }
`;

/* ── контакты ────────────────────────────────────── */

export const ADMIN_LINKS_QUERY = `
  query AdminLinks {
    profile { id links { id kind label url order } }
  }
`;

export const CREATE_LINK_MUTATION = `
  mutation CreateLink($input: CreateLinkInput!) {
    createLink(input: $input) { id kind label url order }
  }
`;

export const UPDATE_LINK_MUTATION = `
  mutation UpdateLink($input: UpdateLinkInput!) {
    updateLink(input: $input) { id kind label url order }
  }
`;

export const DELETE_LINK_MUTATION = `
  mutation DeleteLink($id: ID!) { deleteLink(id: $id) }
`;

/* ── опыт ────────────────────────────────────────── */

const EXPERIENCE_FIELDS = `
  id
  company
  position
  description
  startDate
  endDate
  achievements { id text order }
`;

export const ADMIN_EXPERIENCE_QUERY = `
  query AdminExperience {
    profile { id experience { ${EXPERIENCE_FIELDS} } }
  }
`;

export const CREATE_EXPERIENCE_MUTATION = `
  mutation CreateExperience($input: CreateExperienceInput!) {
    createExperience(input: $input) { ${EXPERIENCE_FIELDS} }
  }
`;

export const UPDATE_EXPERIENCE_MUTATION = `
  mutation UpdateExperience($input: UpdateExperienceInput!) {
    updateExperience(input: $input) { ${EXPERIENCE_FIELDS} }
  }
`;

export const DELETE_EXPERIENCE_MUTATION = `
  mutation DeleteExperience($id: ID!) { deleteExperience(id: $id) }
`;

/* ── проекты ─────────────────────────────────────── */

const PROJECT_FIELDS = `
  id
  name
  description
  repoUrl
  liveUrl
  stack
  order
  images { id url order }
`;

export const ADMIN_PROJECTS_QUERY = `
  query AdminProjects {
    profile { id projects { ${PROJECT_FIELDS} } }
  }
`;

export const CREATE_PROJECT_MUTATION = `
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) { ${PROJECT_FIELDS} }
  }
`;

export const UPDATE_PROJECT_MUTATION = `
  mutation UpdateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) { ${PROJECT_FIELDS} }
  }
`;

export const DELETE_PROJECT_MUTATION = `
  mutation DeleteProject($id: ID!) { deleteProject(id: $id) }
`;

/* ── изображения проектов ────────────────────────── */

export const ADD_PROJECT_IMAGE_MUTATION = `
  mutation AddProjectImage($input: CreateProjectImageInput!) {
    addProjectImage(input: $input) { id url order }
  }
`;

export const DELETE_PROJECT_IMAGE_MUTATION = `
  mutation DeleteProjectImage($id: ID!) { deleteProjectImage(id: $id) }
`;

export const REORDER_PROJECT_IMAGES_MUTATION = `
  mutation ReorderProjectImages($ids: [ID!]!) { reorderProjectImages(ids: $ids) }
`;

export const ADMIN_REVIEWS_QUERY = `
  query AdminReviews {
    reviews { id type authorName company position text rating projectId createdAt }
  }
`;

export const ADMIN_REVIEW_TOKENS_QUERY = `
  query AdminReviewTokens {
    reviewTokens { id type projectId projectName isUsed expiresAt createdAt }
  }
`;

export const ADMIN_PROJECTS_LIGHT_QUERY = `
  query AdminProjectsLight {
    profile { id projects { id name } }
  }
`;

export const CREATE_REVIEW_TOKEN_MUTATION = `
  mutation CreateReviewToken($input: CreateReviewTokenInput!) {
    createReviewToken(input: $input) {
      id type projectId projectName isUsed expiresAt createdAt
    }
  }
`;

export const REVOKE_REVIEW_TOKEN_MUTATION = `
  mutation RevokeReviewToken($id: ID!) { revokeReviewToken(id: $id) }
`;

export const DELETE_REVIEW_MUTATION = `
  mutation DeleteReview($id: ID!) { deleteReview(id: $id) }
`;
