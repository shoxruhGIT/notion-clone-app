import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import IconPicker from "./icon-picker";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/use-cover-image";

interface ToolbarProps {
  document: Doc<"documents">;
  preview?: boolean;
}

const Toolbar = ({ document, preview }: ToolbarProps) => {
  const updateFields = useMutation(api.document.updateFields);
  const coverImage = useCoverImage();

  const textareRef = useRef<HTMLTextAreaElement>(null);

  const [value, setValue] = useState(document.title);
  const [isEditing, setIsEditing] = useState(false);

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

  const disableInput = () => setIsEditing(false);

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  const onInput = (value: string) => {
    setValue(value);
    updateFields({
      id: document._id,
      title: value,
    });
  };

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(document.title);
      textareRef.current?.focus();
    }, 0);
  };

  return (
    <div className="pl-[54px] group relative">
      {!!document.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon">
          <IconPicker onChange={onEmojiChange}>
            <p className="text-6xl hover:opacity-75 transition cursor-pointer">
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

      <div className="opacity-0 group-hover:opacity-100 flex flex-col py-4">
        <div className="">
          {!document.icon && !preview && (
            <IconPicker asChild onChange={onEmojiChange}>
              <Button
                variant={"ghost"}
                className="text-muted-foreground text-xs w-22 cursor-pointer hover:text-muted-foreground"
              >
                <Smile className="h-3 w-3" />
                <span>Add icon</span>
              </Button>
            </IconPicker>
          )}

          {!document.coverImage && !preview && (
            <Button
              variant={"ghost"}
              className="text-muted-foreground text-xs w-22 cursor-pointer hover:text-muted-foreground"
              onClick={coverImage.onOpen}
            >
              <ImageIcon className="h-3 w-3" />
              <span>Add cover</span>
            </Button>
          )}
        </div>

        {!isEditing && !preview ? (
          <TextareaAutosize
            ref={textareRef}
            onBlur={disableInput}
            onKeyDown={onKeyDown}
            value={value}
            onChange={(event) => onInput(event.target.value)}
            placeholder="New page"
            className="text-4xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none mt-4"
          />
        ) : (
          <div
            onClick={enableInput}
            className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
          >
            {document.title}
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
