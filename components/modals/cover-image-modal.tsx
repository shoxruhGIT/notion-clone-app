import { api } from "@/convex/_generated/api";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import React, { useCallback, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { SingleImageDropzone } from "../upload/single-image";
import { UploaderProvider, type UploadFn } from "../upload/uploader-provider";
import { Id } from "@/convex/_generated/dataModel";

const CoverImageModal = () => {
  const params = useParams();
  const updateFields = useMutation(api.document.updateFields);
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onClose = useCallback(() => {
    setIsSubmitting(false);
    coverImage.onClose();
  }, [coverImage]);

  const uploadFn: UploadFn = useCallback(
    async ({ file }) => {
      const res = await edgestore.publicFiles.upload({
        file,
        options: { replaceTargetUrl: coverImage.url },
      });

      updateFields({
        id: params.documentId as Id<"documents">,
        coverImage: res.url,
      });
      onClose();
      console.log(res);
      return { url: res.url };
    },
    [edgestore, coverImage.url, params.documentId, updateFields, onClose]
  );

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onOpen}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <UploaderProvider uploadFn={uploadFn} autoUpload>
          <SingleImageDropzone
            disabled={isSubmitting}
            width={100}
            height={100}
          />
        </UploaderProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CoverImageModal;
