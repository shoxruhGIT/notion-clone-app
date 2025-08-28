import ConfirmModal from "@/components/modals/confirm-modal";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useSubscription from "@/hooks/use-subscriptions";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export const TrashBox = () => {
  const documents = useQuery(api.document.getTrashDocuments);
  const remove = useMutation(api.document.remove);
  const restore = useMutation(api.document.restore);
  const { user } = useUser();

  const router = useRouter();
  const params = useParams();

  const [search, setSearch] = useState("");

  const allDocuments = useQuery(api.document.getAllDocuments);

  const email = user?.emailAddresses[0].emailAddress;

  const { plan } = useSubscription(email!);

  if (documents === undefined) {
    return (
      <div className="flex items-center justify-center">
        <Loader size={"lg"} />
      </div>
    );
  }

  const filteredDocument = documents.filter((document) =>
    document.title.toLowerCase().includes(search.toLowerCase())
  );

  const onRemove = (documentId: Id<"documents">) => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: "Removing document...",
      success: "Removed document!",
      error: "Failed to remove doucment",
    });

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  const onRestore = (documentId: Id<"documents">) => {
    if (allDocuments?.length && allDocuments?.length >= 3 && plan === "Free") {
      toast.error(
        "You already have 3 notes. Please delete one to restore this note"
      );
      return
    }

    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring document...",
      success: "Restored document!",
      error: "Failed to restore document",
    });
  };

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="w-4 h-4" />
        <Input
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents in trash
        </p>
        {filteredDocument.map((document) => (
          <div
            key={document._id}
            role="button"
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between cursor-pointer"
            onClick={() => router.push(`/documents/${document._id}`)}
          >
            <span className="truncate pl-2">{document.title}</span>

            <div className="flex items-center">
              <div
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 cursor-pointer"
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore(document._id);
                }}
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 cursor-pointer"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
