export interface Resource {
    id: string;
    title: string;
    description: string;
    type: "guide" | "documentation" | "video" | "presentation";
    topic: string;
    tags: string[];
    url: string;
  }