import React, { useState } from "react";
import {
  Home,
  Users,
  Package,
  Clipboard
} from "lucide-react";
import Partners from "./components/Partners/Partners";
import Orders from "./components/Orders/Orders";
import Assignments from "./components/Assignments/Assignments";
import Dashboard from "./components/Dashboard/Dashboard";

function Layout() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "partners":
        return <Partners />;
      case "orders":
        return <Orders />;
      case "assignments":
        return <Assignments />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-8">Delivery Management</h1>
        <nav className="space-y-4">
          {[
            { page: "dashboard", icon: Home, label: "Dashboard" },
            { page: "partners", icon: Users, label: "Partners" },
            { page: "orders", icon: Package, label: "Orders" },
            { page: "assignments", icon: Clipboard, label: "Assignments" },
          ].map(({ page, icon: Icon, label }) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`flex items-center space-x-3 hover:bg-gray-700 p-2 rounded w-full text-left 
                    ${currentPage === page ? "bg-gray-700" : ""}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100 overflow-y-auto">{renderPage()}</div>
    </div>
  );
}


export default Layout;
