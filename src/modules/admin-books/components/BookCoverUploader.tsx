"use client";

import { useId, useRef } from "react";

import { AdminSectionCard } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookCoverArt } from "@/modules/catalog/book-cover-art";

import { deriveAdminBookCoverTone } from "../mock-data";
import type { AdminBookCategory, AdminBookFormMode } from "../types";

function deriveCoverLabel(title: string, category: AdminBookCategory) {
  const trimmedTitle = title.trim();

  if (trimmedTitle.length === 0) {
    return category;
  }

  return trimmedTitle.split(/\s+/).slice(0, 2).join(" ");
}

interface BookCoverUploaderProps {
  author: string;
  category: AdminBookCategory;
  error?: string;
  fileName: string;
  mode: AdminBookFormMode;
  onFileNameChange: (fileName: string) => void;
  title: string;
}

function BookCoverUploader({
  author,
  category,
  error,
  fileName,
  mode,
  onFileNameChange,
  title,
}: BookCoverUploaderProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <AdminSectionCard
      title="Cover image"
      description="Use the existing admin cover language for now. This upload area only captures a file name until real media storage is wired."
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(12rem,14rem)_minmax(0,1fr)] lg:items-start">
        <div className="mx-auto w-full max-w-[14rem] lg:mx-0">
          <BookCoverArt
            author={author || "Author name"}
            coverLabel={deriveCoverLabel(title, category)}
            title={title || "Book title"}
            tone={deriveAdminBookCoverTone(category)}
          />
        </div>

        <div className="grid gap-4">
          <div
            className={cn(
              "rounded-card border-border-subtle bg-elevated grid gap-3 border border-dashed p-4 sm:p-5",
              error ? "border-danger bg-danger-surface/30" : undefined,
            )}
          >
            <div className="space-y-1">
              <p className="text-label text-foreground font-medium">
                {fileName.length > 0 ? fileName : "No cover selected yet"}
              </p>
              <p className="text-body-sm text-text-secondary">
                {mode === "create"
                  ? "Upload a mock cover reference so the API contract already expects media metadata."
                  : "Replace the current cover reference if this title has a refreshed edition or a cleaner asset."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                id={inputId}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0];
                  onFileNameChange(selectedFile?.name ?? "");
                }}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                {fileName.length > 0 ? "Replace file" : "Upload file"}
              </Button>
              {fileName.length > 0 ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    onFileNameChange("");

                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Remove file
                </Button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-1">
            <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
              Helper text
            </p>
            <p className="text-body-sm text-text-secondary">
              The preview tone follows the selected category so the form stays
              visually aligned with the existing catalog and admin tables.
            </p>
            {error ? (
              <p className="text-body-sm text-danger" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </AdminSectionCard>
  );
}

export { BookCoverUploader, type BookCoverUploaderProps };