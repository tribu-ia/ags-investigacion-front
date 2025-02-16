export type SuccessResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    githubUsername: string;
    avatarUrl: string;
    repositoryUrl: string;
    linkedinProfile: string | null;
    agentId: string;
    status: string;
    role: string;
  };
  researcher_type: "PRIMARY" | "CONTRIBUTOR";
  presentationDateTime: string | null;
  errorType: string | null;
  errorCode: string | null;
} 