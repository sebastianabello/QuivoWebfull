// src/pages/admin/EditRoom.tsx
import React from "react";
import RoomForm from "./RoomForm";
import { useParams } from "react-router-dom";

export default function EditRoom() {
  const { code } = useParams();

  return (
    <div>
      <RoomForm />
    </div>
  );
}
