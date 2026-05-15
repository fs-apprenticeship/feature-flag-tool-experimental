export interface Organization {
  id: string;
  name: string;
  key: string;
  slug: string;
}

export type CreateOrganization = {
  name: string;
};

export interface CreateOrgOptions {
  data: CreateOrganization;
}
