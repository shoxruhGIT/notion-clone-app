"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import useSubscription from "@/hooks/use-subscriptions";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const DocumentPage = () => {
  const { user } = useUser();
  const createDocument = useMutation(api.document.createDocument);
  const router = useRouter();

  const email = user?.emailAddresses[0].emailAddress;

  const { plan } = useSubscription(email!);

  const documents = useQuery(api.document.getAllDocuments);

  const onCreateDocument = () => {
    if (documents?.length && documents.length >= 3 && plan === "Free") {
      toast.error("You can only create 3 documents in the free plan");
      return;
    }

    const promise = createDocument({
      title: "Untitled",
    }).then((docId) => router.push(`/documents/${docId}`));

    toast.promise(promise, {
      loading: "Creating a new blank",
      success: "Blank created successfully!",
      error: "Failed to create blank",
    });
  };

  return (
    <div className="h-screen w-full flex justify-center items-center space-y-4 flex-col">
      <Image
        src={"/note.svg"}
        alt="Logo"
        width={300}
        height={300}
        className="object-cover dark:hidden"
      />
      <Image
        src={"/note-dark.svg"}
        alt="Logo"
        width={300}
        height={300}
        className="object-cover hidden dark:block"
      />
      <h2 className="text-lg font-bold">
        Welcome to {user?.firstName}`s document page!
      </h2>
      <Button onClick={onCreateDocument} className="cursor-pointer">
        <Plus className="w-4 h-4 mr-1" />
        Create blank
      </Button>
    </div>
  );
};

export default DocumentPage;
