export interface SourceUnit {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
}

export interface CreateSourceUnitData {
  name: string;
}
