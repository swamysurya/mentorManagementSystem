import React, { createContext, useState, useEffect } from "react";
import api from "../utils/common/axios";

export const CloudinaryStatusContext = createContext(null);

export function CloudinaryStatusProvider({ children }) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    api
      .get("/api/cloudinary-status")
      .then((res) => setActive(res.data.active))
      .catch(() => setActive(false));
  }, []);
  return (
    <CloudinaryStatusContext.Provider value={active}>
      {children}
    </CloudinaryStatusContext.Provider>
  );
}
