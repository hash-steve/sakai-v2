import React from 'react'

export default class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        hasError: false, 
        error: null, 
        errorInfo: null 
    };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      this.setState({error: error, errorInfo: errorInfo})
      //logErrorToMyService(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return <h1>Something went wrong. {this.state.error}: {this.state.errorInfo}</h1>;
      }
  
      return this.props.children; 
    }
  }