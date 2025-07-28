import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import React from "react";
import { Button } from "../ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import IconPicker from "./icon-picker";

interface ToolbarProps {
  document: Doc<"documents">;
  preview?: boolean;
}

const Toolbar = ({ document, preview }: ToolbarProps) => {
  const updateFields = useMutation(api.document.updateFields);

  const onEmojiChange = (icon: string) => {
    updateFields({
      id: document._id,
      icon,
    });
  };

  const onRemove = () => {
    updateFields({
      id: document._id,
      icon: "",
    });
  };

  return (
    <div className="pl-[54px] group relative">
      {!!document.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-2">
          <IconPicker onChange={onEmojiChange}>
            <p className="text-6xl hover:opacity-75 transition">
              {document.icon}
            </p>
          </IconPicker>
          <Button
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant={"outline"}
            size={"icon"}
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!!document.icon && preview && (
        <p className="text-6xl pt-6">{document.icon}</p>
      )}

      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!document.icon && !preview && (
          <IconPicker asChild onChange={onEmojiChange}>
            <Button
              size={"sm"}
              variant={"outline"}
              className="text-muted-foreground text-xs"
            >
              <Smile className="h-4 w-4 mr-2" />
              <span>Add icon</span>
            </Button>
          </IconPicker>
        )}

        {!document.coverImage && !preview && (
          <Button
            size={"sm"}
            variant={"outline"}
            className="text-muted-foreground text-xs"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            <span>Add cover</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
