import { API_BASE_URL } from "./api";

export type Issue = {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  projectId: number;
  projectName: string;
};

export type CreateIssueRequest = {
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId: number;
};

export type UpdateIssueRequest = {
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId: number;
};

export type PagedIssuesResponse = {
  data: Issue[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export const getIssues = async (params?: {
  search?: string;
  status?: string;
  priority?: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<PagedIssuesResponse> => {
  const query = new URLSearchParams();

  if (params?.search) query.append("search", params.search);
  if (params?.status) query.append("status", params.status);
  if (params?.priority) query.append("priority", params.priority);
  if (params?.pageNumber) query.append("pageNumber", params.pageNumber.toString());
  if (params?.pageSize) query.append("pageSize", params.pageSize.toString());

  const response = await fetch(`${API_BASE_URL}/issues?${query.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch issues");
  }

  return response.json();
};

export const getIssueById = async (id: number): Promise<Issue> => {
  const response = await fetch(`${API_BASE_URL}/issues/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch issue");
  }

  return response.json();
};

export const createIssue = async (issueData: CreateIssueRequest) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/issues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(issueData),
  });

  if (!response.ok) {
    throw new Error("Failed to create issue");
  }

  return response.json();
};

export const updateIssue = async (
  id: number,
  issueData: UpdateIssueRequest
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(issueData),
  });

  if (!response.ok) {
    throw new Error("Failed to update issue");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const deleteIssue = async (id: number) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete issue");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};