import { Id } from "@/convex/_generated/dataModel";
import DocumentClientPage from "./DocumentClientPage";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const Page = ({ params }: DocumentIdPageProps) => {
  return <DocumentClientPage documentId={params.documentId} />;
};

export default Page;
