import type { FullSubjectData } from "@/lib/mold-types"

export interface LinkTabContentProps {
  encoding: boolean;
  encodeError: string | null;
  shareUrl: string;
  shortUrl: string;
  copyState: CopyState;
  shortenState: ShortenState;
  shortenError: string | null;
  sizeKb: string;
  isSizeLarge: boolean;
  onCopy: () => void;
  onShorten: () => void;
  onCopyShortUrl: () => void;
}

export interface FileTabContentProps {
  subject: FullSubjectData;
  onDownload: () => void;
}

export interface ShareModalProps {
  subject: FullSubjectData
  onClose: () => void
}

export type Tab = "link" | "file"
export type CopyState = "idle" | "copied" | "error"
export type ShortenState = "idle" | "loading" | "done"
