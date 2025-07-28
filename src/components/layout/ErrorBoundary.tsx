import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // Forçar refresh da página se necessário
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">
                Ops! Algo deu errado
              </h1>
              <p className="text-muted-foreground">
                Encontramos um erro inesperado. Tente recarregar a página.
              </p>
            </div>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-mono text-sm">
                {this.state.error?.message || 'Erro desconhecido'}
              </AlertDescription>
            </Alert>

            <Button 
              onClick={this.handleReset}
              className="w-full"
              size="lg"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recarregar Página
            </Button>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4 p-4 bg-muted rounded-md text-sm">
                <summary className="cursor-pointer font-semibold">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs overflow-auto">
                  {this.state.error?.stack}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}