import React from "react";

type Status = "Pending" | "In Progress" | "Completed";

const statusStyles: Record<Status, string> = {
  Pending: "bg-amber-100 text-amber-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

interface Props {
  status: Status;
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};
