import React, { useState, useEffect, useCallback } from "react";

interface Props {
  children: React.ReactNode;
  fallBackComponent: React.ReactNode;
  resetCondition?: any;
  error?: boolean;
  isLoader?: boolean;
  loadingComponent?: React.ReactNode;
}

export const ErrorBoundary = ({
  children,
  fallBackComponent,
  resetCondition,
  error,
  isLoader,
  loadingComponent,
}: Props) => {
  const [hasError, setHasError] = useState(false);
  const [prevResetCondition, setPrevResetCondition] = useState(resetCondition);

  const handleResetCondition = useCallback(() => {
    if (resetCondition !== prevResetCondition) {
      setHasError(false);
      setPrevResetCondition(resetCondition);
    }
  }, [resetCondition, prevResetCondition]);

  useEffect(() => {
    handleResetCondition();
  }, [handleResetCondition]);

  const errorHandler = useCallback(() => {
    setHasError(true);
  }, []);

  if (hasError || error) {
    return <>{fallBackComponent}</>;
  }

  return (
    <ErrorCatcher onError={errorHandler}>
      {isLoader ? loadingComponent : children}
    </ErrorCatcher>
  );
};

//* Utility component to simulate `componentDidCatch` in functional components
interface ErrorCatcherProps {
  children: React.ReactNode;
  onError: () => void;
}

const ErrorCatcher = ({ children, onError }: ErrorCatcherProps) => {
  try {
    return <>{children}</>;
  } catch (e) {
    onError();
    return null;
  }
};
