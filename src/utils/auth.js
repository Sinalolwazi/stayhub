import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

/**
 * Google OAuth Provider wrapper
 * Wraps children with Google OAuth context using environment client ID
 */
export const GoogleAuthProvider = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={"504049086241-0mcvnujt5aq066pjakh26ei07rpdh9au.apps.googleusercontent.com"}>
      {children}
    </GoogleOAuthProvider>
  );
};

/**
 * Re-export GoogleLogin component for convenience
 */
export { GoogleLogin };