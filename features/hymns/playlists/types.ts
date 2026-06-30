import type { Hymn } from "../types";

export interface HymnPlaylist {
  id: string;
  title: string;
  description?: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  itemCount?: number;
}

export interface HymnPlaylistItem {
  id: string;
  playlistId: string;
  hymnId: string;
  position: number;
  transposeSteps: number;
  createdAt: string;
  hymn?: Hymn;
}

export interface HymnPlaylistWithItems extends HymnPlaylist {
  items: HymnPlaylistItem[];
}

export interface CreatePlaylistInput {
  title: string;
  description?: string;
}

export interface UpdatePlaylistInput {
  title: string;
  description?: string;
}

export interface AddToPlaylistInput {
  playlistId: string;
  hymnId: string;
  transposeSteps: number;
}
