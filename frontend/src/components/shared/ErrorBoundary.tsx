import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-base text-slate-100 flex items-center justify-center p-4">
          <div className="absolute top-[-25%] left-[-15%] w-[70%] h-[70%] rounded-full bg-brand-primary/5 blur-[160px] pointer-events-none" />
          <div className="absolute bottom-[-25%] right-[-15%] w-[70%] h-[70%] rounded-full bg-brand-secondary/5 blur-[160px] pointer-events-none" />
          
          <div className="bento-card max-w-md w-full flex flex-col gap-6 text-center border-brand-danger/30 relative z-10">
            <div className="w-16 h-16 rounded-full bg-brand-danger/10 border border-brand-danger/20 flex items-center justify-center mx-auto text-3xl">
              ⚠️
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-200 font-display">Đã xảy ra lỗi hệ thống</h2>
              <p className="text-slate-400 text-sm mt-2">
                Ứng dụng gặp sự cố không mong muốn. Vui lòng thử lại hoặc tải lại trang.
              </p>
              {this.state.error && (
                <pre className="mt-4 p-3 bg-black/50 border border-border-default rounded-xl text-left text-xs font-mono overflow-auto max-h-40 text-brand-danger">
                  {this.state.error.toString()}
                </pre>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3.5 btn-brand-primary btn-glint text-xs uppercase tracking-wider font-extrabold rounded-full transition-all duration-200 active:scale-98 cursor-pointer"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
