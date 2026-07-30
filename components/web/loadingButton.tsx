import * as React from "react";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loading: boolean;
}

export function LoadingButton({
  loading,
  disabled,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={loading || disabled} {...props} size='lg'>
      {loading ? <Loader className="animate-spin" /> : children}
    </Button>
  );
}