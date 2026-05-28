import { supabase } from "./supabase";

// Sign Up
export const signUp = async (email, password, name, role) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name, role: role }
    }
  });
  if (error) throw error;
  return data;
};

// Login
export const logIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
};

// Google Login
export const googleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google"
  });
  if (error) throw error;
};

// Logout
export const logOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Watch login state changes
export const onAuthChange = (callback) => {
  supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
};