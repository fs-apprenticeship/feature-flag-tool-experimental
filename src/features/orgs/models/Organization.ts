export interface Organization {
  id: string;
  name: string;
}

export interface OrgRow {
    id: string;
    name: string;
    key: string;
    slug: string;
}

export type CreateOrganization = Omit<Organization, 'id'>;

export interface CreateOrgOptions {
  data: CreateOrganization;
}

export class Organization {
    id: string;
    name: string;
    key: string
    slug: string;
    constructor(row: OrgRow) {
        this.id = row.id;
        this.name = row.name;
        this.key = row.key;
        this.slug = row.slug;
  }
}