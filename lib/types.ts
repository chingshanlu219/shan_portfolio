import { Language } from "./i18n";

export interface HomepagePicture {
  id: string;
  imageUrl: string;
  order: number;
}

export type LocalizedString = Partial<Record<Language, string>>;

export interface Project {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  coverImage: string;
  images: string[];
  content: LocalizedString;
  order: number;
  createdAt: Date;
}

export interface Sketch {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  coverImage: string;
  images: string[];
  content: LocalizedString;
  order: number;
  createdAt: Date;
}
