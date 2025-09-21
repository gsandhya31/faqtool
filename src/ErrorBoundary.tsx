// src/ErrorBoundary.tsx
import React from "react";

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log error for debugging or to an external service
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
          <h1 style={{ color: "#b00020" }}>Application error</h1>
          <p><strong>Message:</strong> {this.state.error.message}</p>
          <details style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>
            {this.state.error.stack}
          </details>
          <p style={{ marginTop: 16 }}>
            Try <a href={window.location.href}>refreshing</a>. Paste the message and stack here and I will diagnose.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
