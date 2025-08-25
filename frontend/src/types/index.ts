export interface Book {
  id: string;
  authors: string[];
  imageLinks: { smallThumbnail: string; thumbnail: string };
  industryIdentifiers: { type: string; identifier: string }[];
  publishedDate: string;
  publisher: string;
  title: string;
}

export type SearchState =
  | "idle"
  | "loading"
  | "success"
  | "notFound"
  | "scraping"
  | "scrapingNotFound";
