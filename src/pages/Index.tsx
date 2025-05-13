
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the dashboard page
    navigate("/dashboard");
  }, [navigate]);

  // Show a loading skeleton while redirecting
  return (
    <div className="container mx-auto py-10 px-4">
      <Skeleton className="h-12 w-3/4 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-80 w-full mb-8" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
};

export default Index;
