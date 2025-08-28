import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  Rocket,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { DocumentList } from "./document-list";
import { UserBox } from "./user-box";
import { Item } from "./item";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TrashBox } from "./trash-box";
import { Progress } from "@/components/ui/progress";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Navbar } from "./navbar";
import { useSearch } from "@/hooks/use-search";
import { useSetting } from "@/hooks/use-setting";
import { useUser } from "@clerk/clerk-react";
import useSubscription from "@/hooks/use-subscriptions";
import { Loader } from "@/components/ui/loader";

export const Sidebar = () => {
  const isMobile = useMediaQuery("(max-width: 770px)");

  const createDocument = useMutation(api.document.createDocument);
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();

  const { onOpen } = useSearch();

  const setting = useSetting();

  const sidebarRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const email = user?.emailAddresses[0].emailAddress;

  const { isLoading, plan } = useSubscription(email!);

  const documents = useQuery(api.document.getAllDocuments);

  const lng: number = documents?.length || 0;

  const progress = Math.min((lng / 3) * 100, 100);

  console.log(documents);

  const collapse = useCallback(() => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.width = "100%";
      navbarRef.current.style.left = "0";
      setTimeout(() => setIsResetting(false), 300);
    }
  }, []);

  const reset = useCallback(() => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.width = isMobile ? "0" : "calc(100% - 240px)";
      navbarRef.current.style.left = isMobile ? "100%" : "240px";

      setTimeout(() => setIsResetting(false), 300);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      reset();
    }
  }, [isMobile, collapse, reset]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizing.current = true;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizing) return;

    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 400) newWidth = 400;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.left = `calc(100% - ${newWidth}px)`;
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

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
    <>
      <div
        className={cn(
          "group/sidebar h-screen bg-secondary overflow-y-auto w-60 z-50 sticky left-0 top-0",
          isResetting && "transition-all ease-in duration-300",
          isMobile && "w-0"
        )}
        ref={sidebarRef}
      >
        <div
          className="h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition cursor-pointer
        "
          role="button"
          onClick={collapse}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>

        <div>
          <UserBox />
          <Item
            label="Search"
            icon={Search}
            isSearch
            onClick={() => onOpen()}
          />
          <Item
            label="Settings"
            icon={Settings}
            isSettings
            onClick={() => setting.onOpen()}
          />
          <Item onClick={onCreateDocument} label="New document" icon={Plus} />
        </div>

        <div className="mt-4">
          <DocumentList />
          <Item onClick={onCreateDocument} label="Add a page" icon={Plus} />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash2} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>

        <div
          className="absolute right-0 top-0 w-1 h-full cursor-ew-resize bg-primary/10 opacity-0 group-hover/sidebar:opacity-100 transition"
          onMouseDown={handleMouseDown}
        />

        <div className="absolute bottom-0 px-2 bg-white/50 dark:bg-black/50 py-4 w-full">
          {isLoading ? (
            <div className="w-full flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-[13px]">
                  <Rocket />
                  <p className="opacity-70 font-bold"> {plan} plan</p>
                </div>

                {plan === "Free" ? (
                  <p className="text-[13px] opacity-70">
                    {documents?.length}/3
                  </p>
                ) : (
                  <p className="text-[13px] opacity-70">
                    {documents?.length} notes
                  </p>
                )}
              </div>
              <Progress value={progress} className="mt-2" />
            </>
          )}
        </div>
      </div>

      <div
        className={cn(
          "absolute top-0 z-50 left-60 w-[calc(100% - 240px)]",
          isResetting && "transition-all ease-in duration-300"
        )}
        ref={navbarRef}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} reset={reset} />
        ) : (
          <nav className={cn("bg-transparent px-3 py-2 w-full")}>
            {isCollapsed && (
              <MenuIcon
                className="h-6 w-6 text-muted-foreground cursor-pointer"
                role="button"
                onClick={reset}
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};
