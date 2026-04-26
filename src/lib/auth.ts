import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

export interface UserProfile {
  uid: string;
  email: string;
  plan: "free" | "pro" | "business";
  searchesToday: number;
  lastSearchDate: string;
  stripeCustomerId?: string;
  createdAt: any;
}

export async function signUp(email: string, password: string) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await createProfile(user);
  return user;
}

export async function signIn(email: string, password: string) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function signInWithGoogle() {
  const { user } = await signInWithPopup(auth, googleProvider);
  const profile = await getProfile(user.uid);
  if (!profile) await createProfile(user);
  return user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}

async function createProfile(user: User) {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    plan: "free",
    searchesToday: 0,
    lastSearchDate: "",
    createdAt: serverTimestamp(),
  });
}

export async function getProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function canSearch(uid: string): Promise<boolean> {
  const profile = await getProfile(uid);
  if (!profile) return false;
  if (profile.plan === "pro" || profile.plan === "business") return true;
  const today = new Date().toISOString().slice(0, 10);
  if (profile.lastSearchDate !== today) return true;
  return profile.searchesToday < 5;
}

export async function recordSearch(uid: string) {
  const today = new Date().toISOString().slice(0, 10);
  const profile = await getProfile(uid);
  if (!profile) return;
  const newCount = profile.lastSearchDate === today
    ? profile.searchesToday + 1
    : 1;
  await updateDoc(doc(db, "users", uid), {
    searchesToday: newCount,
    lastSearchDate: today,
  });
}
