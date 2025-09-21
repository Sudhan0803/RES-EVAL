import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  AuthError,
  UserCredential
} from 'firebase/auth';
import { SparklesIcon } from './icons/SparklesIcon';
import { addUserOnSignup } from '../services/firestoreService';

const Login: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getFirebaseErrorMessage = (authError: AuthError): string => {
    switch (authError.code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/operation-not-allowed':
        return 'Authentication is not enabled. Please enable Email/Password sign-in in your Firebase project settings.';
      default:
        console.error("Unhandled Firebase Auth Error:", authError);
        return 'An unexpected error occurred. Please check your Firebase configuration and internet connection.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isLoginView) {
      // --- Login Flow ---
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // On success, the onAuthStateChanged listener in App.tsx will handle the redirect.
      } catch (err) {
        if (err instanceof Error && 'code' in err) {
           setError(getFirebaseErrorMessage(err as AuthError));
        } else {
           setError('An unknown error occurred during sign-in.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      // --- Sign Up Flow ---
      let userCredential: UserCredential | undefined;
      try {
        // Step 1: Create the user in Firebase Auth
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } catch (authError) {
        if (authError instanceof Error && 'code' in authError) {
           setError(getFirebaseErrorMessage(authError as AuthError));
        } else {
           setError('An unknown error occurred during account creation.');
        }
        setLoading(false);
        return; // Stop if authentication fails
      }

      // Step 2: If auth user was created, try to add their details to Firestore
      try {
        if (userCredential) {
          await addUserOnSignup(userCredential.user);
        }
        // Success is handled by onAuthStateChanged in App.tsx
      } catch (dbError) {
        console.error("Firestore write error during signup:", dbError);
        // This is a non-critical error. The user is authenticated.
        // The onAuthStateChanged will still fire and log them in.
        // We show this error to help the developer debug their Firestore setup.
        setError("Account created, but failed to save user details to the database. Please check your Firestore setup. You can now log in.");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full">
         <div className="flex items-center justify-center mb-6">
            <SparklesIcon className="h-10 w-10 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-slate-900">
              Skill Scan
            </h1>
          </div>
        <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
            {isLoginView ? 'Welcome Back!' : 'Create an Account'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {error && <p className="text-sm text-center text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400"
              >
                {loading ? 'Please wait...' : (isLoginView ? 'Sign in' : 'Sign Up')}
              </button>
            </div>
          </form>
           <p className="mt-6 text-center text-sm text-slate-600">
            {isLoginView ? "Don't have an account?" : 'Already have an account?'}
            <button onClick={toggleView} className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
              {isLoginView ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;