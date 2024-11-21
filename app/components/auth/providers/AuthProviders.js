import SignInWithGoogle from "./SignInWithGoogle";
import SignInWithFacebook from "./SignInWithFacebook";

export default function AuthProviders({ isConnected, buttonText }) {
  return (
    <div className="flex gap-2">
      <SignInWithGoogle isConnected={isConnected} buttonText={buttonText} />
      <SignInWithFacebook isConnected={isConnected} buttonText={buttonText} />
    </div>
  );
}
