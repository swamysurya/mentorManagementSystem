import React, { useContext } from "react";
import { CloudinaryStatusContext } from "../context/CloudinaryStatusContext";

export default function CloudinaryStatusIndicator() {
  const active = useContext(CloudinaryStatusContext);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: active === null ? "#ccc" : active ? "#22c55e" : "#ef4444",
          display: "inline-block",
        }}
      />
      <span>
        Cloudinary:{" "}
        {active === null ? "Checking..." : active ? "Active" : "Not Configured"}
      </span>
    </div>
  );
}
