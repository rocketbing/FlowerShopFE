import "./App.css";
import Router from "./router";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  // If Google Client ID is not configured, render Router without GoogleOAuthProvider
  if (!googleClientId) {
    console.warn("REACT_APP_GOOGLE_CLIENT_ID is not set. Google login will not work.");
    return <Router />;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router />
    </GoogleOAuthProvider>
  );
}

export default App;
