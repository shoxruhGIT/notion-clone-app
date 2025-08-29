import { Id } from "@/convex/_generated/dataModel";
import DocumentClientPage from "./DocumentClientPage";

interface DocumentIdPageProps {
  params: {
    documentId: string
  };
}

const Page = ({ params }: DocumentIdPageProps) => {
  return <DocumentClientPage documentId={params.documentId as Id<"documents">} />;
};

export default Page;
