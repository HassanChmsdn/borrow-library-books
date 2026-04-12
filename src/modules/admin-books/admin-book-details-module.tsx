"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminEmptyState, AdminPageHeader } from "@/components/admin";
import { LoadingSkeleton } from "@/components/feedback";
import { Button } from "@/components/ui/button";

import {
  adminBookCreateDefaults,
  adminBookDurationOptions,
  createAdminBookFormValues,
} from "./mock-data";
import { useAdminBookDetailsFormState } from "./hooks";
import type { AdminBookDetailsModuleProps } from "./types";
import { BookDetailsForm } from "./components";

function AdminBookDetailsModule({
  book,
  isLoading = false,
  mode,
  onDeleteBook,
  onSaveBook,
}: AdminBookDetailsModuleProps) {
  const initialValues = useMemo(() => {
    if (mode === "edit" && book) {
      return createAdminBookFormValues(book);
    }

    return adminBookCreateDefaults;
  }, [book, mode]);

  const {
    errors,
    handleDelete,
    handleSubmit,
    isDeleting,
    isSubmitting,
    setAllowCustomDuration,
    setBasicInfoField,
    setCoverFileName,
    setFeeAmount,
    setFeeMode,
    setMetadataField,
    setStatus,
    submissionState,
    toggleDuration,
    values,
  } = useAdminBookDetailsFormState({
    book,
    initialValues,
    mode,
    onDeleteBook,
    onSaveBook,
  });

  if (isLoading) {
    return <AdminBookDetailsLoadingState mode={mode} />;
  }

  if (mode === "edit" && !book) {
    return <AdminBookDetailsEmptyState />;
  }

  const isCreateMode = mode === "create";

  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Catalog"
        title={isCreateMode ? "Add new book" : `Edit ${book?.title ?? "book"}`}
        description={
          isCreateMode
            ? "Create a new catalog record with fee, duration, metadata, and cover details stored directly in MongoDB."
            : "Update catalog details, fee behavior, and circulation settings while keeping the admin record synchronized with the live data store."
        }
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/books">
              <ArrowLeft className="size-4" />
              Back to books
            </Link>
          </Button>
        }
      />

      <BookDetailsForm
        book={book}
        durationOptions={adminBookDurationOptions}
        errors={errors}
        isDeleting={isDeleting}
        isSubmitting={isSubmitting}
        mode={mode}
        onAllowCustomDurationChange={setAllowCustomDuration}
        onBasicInfoChange={setBasicInfoField}
        onCoverFileNameChange={setCoverFileName}
        onDelete={handleDelete}
        onFeeAmountChange={setFeeAmount}
        onFeeModeChange={setFeeMode}
        onMetadataChange={setMetadataField}
        onStatusChange={setStatus}
        onSubmit={handleSubmit}
        onToggleDuration={toggleDuration}
        submissionState={submissionState}
        values={values}
      />
    </div>
  );
}

function AdminBookDetailsEmptyState() {
  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Edit book"
        description="The selected mock book record could not be found in the admin catalog source."
      />

      <AdminEmptyState
        title="Book not found"
        description="Return to the books table and choose another record. The selected book no longer exists in the current catalog data."
        action={
          <Button asChild>
            <Link href="/admin/books">Back to books</Link>
          </Button>
        }
      />
    </div>
  );
}

function AdminBookDetailsLoadingState({
  mode,
}: Readonly<{ mode: AdminBookDetailsModuleProps["mode"] }>) {
  return (
    <div className="gap-section flex flex-col">
      <AdminPageHeader
        eyebrow="Catalog"
        title={mode === "create" ? "Add new book" : "Edit book"}
        description="Preparing the book details form, publication metadata, and inventory summary panels."
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]">
        <div className="grid gap-5">
          <LoadingSkeleton count={5} variant="card" />
        </div>
        <div className="grid gap-5">
          <LoadingSkeleton count={2} variant="card" />
        </div>
      </section>
    </div>
  );
}

export {
  AdminBookDetailsEmptyState,
  AdminBookDetailsLoadingState,
  AdminBookDetailsModule,
};