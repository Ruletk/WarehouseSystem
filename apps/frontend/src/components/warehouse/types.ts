export interface Warehouse {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  tagId: number;
  tag: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  userId: number;
  role: string;
  assignedAt: Date;
}
