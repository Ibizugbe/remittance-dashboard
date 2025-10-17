import React from "react";
import Button from "../ui/Button";

type State = { hasError: boolean; message?: string };

export default class AppErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: any) {
    return { hasError: true, message: err?.message ?? "Something went wrong" };
  }

  componentDidCatch(error: any, info: any) {
    console.error("App crash:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] grid place-items-center p-6">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="text-sm text-slate-600 mt-1">{this.state.message}</p>
            <div className="mt-4 flex justify-center gap-2">
              <Button onClick={() => location.reload()}>Reload</Button>
              <Button
                variant="secondary"
                onClick={() =>
                  history.length ? history.back() : (location.href = "/")
                }
              >
                Go back
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
