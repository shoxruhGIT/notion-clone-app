import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { api } from "@/convex/_generated/api";
import {  useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import React from "react";

export const TrashBox = () => {
  const documents = useQuery(api.document.getTrashDocuments);

  if (documents === undefined) {
    return (
      <div className="flex items-center justify-center">
        <Loader size={"lg"} />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="w-4 h-4" />
        <Input
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
      </div>

      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents in trash
        </p>
        {documents.map((document) => (
          <div
            key={document._id}
            role="button"
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between cursor-pointer"
          >
            <span className="truncate pl-2">{document.title}</span>

            <div className="flex items-center">
              <div
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 cursor-pointer"
                role="button"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <div
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 cursor-pointer"
              >
                <Trash className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
