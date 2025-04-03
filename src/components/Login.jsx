import React, { useState } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import googlelogo from '../assets/google.png'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        localStorage.setItem("role", userDoc.data().role);
        navigate("/dashboard");
      } else {
        console.error("User not found in Firestore");
      }
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  // 🔹 Google Login Function
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: "tenant", // Default role, can be changed later
        });
      }

      localStorage.setItem("role", userDoc.data()?.role || "tenant");
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Login error:", error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-3"
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-3"
          placeholder="Password"
          required
        />
        <button type="submit" className="bg-green-500 text-white p-2 w-full">
          Login
        </button>
      </form>

      <div className="flex justify-center mt-4">
        <button
          onClick={handleGoogleLogin}
          className="flex items-center gap-2 p-2 border rounded bg-white shadow-md"
        >
          <img
            src={googlelogo}
            alt="Google Logo"
            className="w-6 h-6"
          />
          Sign in with Google
        </button>
      </div>

      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-500">
          Register
        </a>
      </p>
    </div>
  );
}
