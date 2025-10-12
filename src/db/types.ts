export type UpdateDbRow<T> = Partial<Omit<T, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;
export type MetadataColumn<T = never> = Record<string, string | number | boolean | T | null>;
