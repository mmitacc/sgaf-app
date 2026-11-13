import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  titulo?: string;
}

interface State {
  tieneError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { tieneError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { tieneError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary capturado:", error, errorInfo.componentStack);
  }

  private handleReset = () => {
    this.setState({ tieneError: false, error: null });
  };

  render() {
    if (this.state.tieneError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 p-6 text-center">
          <div className="rounded-full bg-red-100 p-3 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-base font-bold text-slate-900">
            {this.props.titulo ?? "Ocurrió un error al mostrar esta sección"}
          </h3>
          <p className="mt-1 max-w-md text-xs text-slate-500">
            {this.state.error?.message || "Error inesperado de renderizado."}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Intentar de nuevo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
