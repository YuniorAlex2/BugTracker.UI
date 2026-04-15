import { API_BASE_URL } from "./api";

export interface ProjectIssue {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  projectId: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  owner: string;
  createdAt: string;
  issues?: ProjectIssue[];
}

export interface CreateProjectDto {
  name: string;
  description: string;
  owner: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${API_BASE_URL}/projects`);

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  const data = await response.json();

  // If your backend returns paginated data like { data: [...] }
  if (data.data) {
    return data.data;
  }

  // If your backend returns the array directly
  return data;
};

export const getProjectById = async (id: number): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  return response.json();
};

export const getProjectIssues = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}/issues`);

  if (!response.ok) {
    throw new Error("Failed to fetch project issues");
  }

  return response.json();
};

export const createProject = async (projectData: CreateProjectDto) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return response.json();
};
