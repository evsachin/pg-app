import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function PGManagementApp() {
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role") || "tenant");
  const [tenants, setTenants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotices();
    fetchTenants();
  }, []);

  const fetchNotices = async () => {
    const querySnapshot = await getDocs(collection(db, "notices"));
    setNotices(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const fetchTenants = async () => {
    const querySnapshot = await getDocs(collection(db, "tenants"));
    setTenants(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const addNotice = async () => {
    if (newNotice.trim()) {
      const docRef = await addDoc(collection(db, "notices"), {
        message: newNotice,
        author: role,
      });
      setNotices([
        ...notices,
        { id: docRef.id, message: newNotice, author: role },
      ]);
      setNewNotice("");
    }
  };

  const payRent = async (id) => {
    const tenantRef = doc(db, "tenants", id);
    await updateDoc(tenantRef, { rentPaid: true });
    setTenants(
      tenants.map((tenant) =>
        tenant.id === id ? { ...tenant, rentPaid: true } : tenant
      )
    );
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">OM Shiv Sai PG</h2>
      <button
        onClick={logout}
        className="mb-4 p-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Notice Board</h3>
        <ul className="mb-4">
          {notices.map((notice) => (
            <li key={notice.id} className="p-2 mb-2 bg-white rounded shadow">
              <span className="font-semibold">{notice.author}:</span>{" "}
              {notice.message}
            </li>
          ))}
        </ul>
        {role === "owner" && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newNotice}
              onChange={(e) => setNewNotice(e.target.value)}
              className="p-2 border rounded flex-1"
              placeholder="Write a notice..."
            />
            <button
              onClick={addNotice}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Post
            </button>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold">Tenant Rent Payment</h3>
        <ul>
          {tenants.map((tenant) => (
            <li
              key={tenant.id}
              className="p-2 mb-2 bg-white rounded shadow flex justify-between"
            >
              <span>
                {tenant.name} - {tenant.rentPaid ? "Paid" : "Pending"}
              </span>
              {!tenant.rentPaid && role === "tenant" && (
                <button
                  onClick={() => payRent(tenant.id)}
                  className="p-2 bg-green-500 text-white rounded"
                >
                  Pay Rent
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
