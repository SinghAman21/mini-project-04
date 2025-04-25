import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

export default function ErrorPage() {
  const error = useRouteError();
  
  let errorMessage: string;
  let statusText: string = "";
  
  if (isRouteErrorResponse(error)) {
    // error is type RouteErrorResponse
    errorMessage = error.data?.message || error.statusText;
    statusText = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Unknown error';
  }

  return (
    <div className="min-h-screen bg-light-200 dark:bg-dark-300 flex items-center justify-center p-6">
      <div className="max-w-md w-full px-8 py-10 bg-white dark:bg-dark-200 rounded-lg shadow-lg border border-dashed border-gray-300 dark:border-gray-800 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-destructive/10 dark:bg-destructive/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-destructive h-8 w-8" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {statusText || "Oops!"}
        </h1>
        
        <p className="text-muted-foreground mb-6">
          {errorMessage || "Sorry, an unexpected error has occurred."}
        </p>
        
        <Button asChild className="flex items-center gap-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}