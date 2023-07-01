import React, { createContext, useEffect, useState } from 'react';

// Import the supabase instance from your App.js file
import supabase from './supabase';

// Create a new context with an initial value of null
export const SupabaseContext = createContext(null);

// Create a provider component for the context
export function SupabaseProvider({ children }) {
  // Create a state variable to store the current user session
  const [session, setSession] = useState(null);

  // Create a function to update the session state variable
  function updateSession(newSession) {
    setSession(newSession);
  }

  // Use the useEffect hook to listen for changes to the authentication state
  useEffect(() => {
    // Set up the listener using supabase.auth.onAuthStateChange
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (event === 'SIGNED_IN') {
          updateSession(newSession);
        } else if (event === 'SIGNED_OUT') {
          updateSession(null);
        }
      }
    );

    // Clean up the listener when the component unmounts
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Render the provider component with the current session and update function as the value prop
  return (
    <SupabaseContext.Provider value={{ session, updateSession }}>
      {children}
    </SupabaseContext.Provider>
  );
}
