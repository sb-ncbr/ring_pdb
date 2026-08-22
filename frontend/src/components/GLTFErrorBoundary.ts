import React from 'react';

interface GLTFErrorBoundaryProps {
  children: React.ReactNode;
  onError: () => void;
}

interface GLTFErrorBoundaryState {
  hasError: boolean;
}

export class GLTFErrorBoundary extends React.Component<
  GLTFErrorBoundaryProps,
  GLTFErrorBoundaryState
> {
  state: GLTFErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): GLTFErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}