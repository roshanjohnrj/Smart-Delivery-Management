import React, { useEffect, useState } from "react";
import { Users, Package, TrendingUp, CheckCircle,RotateCcw } from "lucide-react";
import { MetricCard } from "../MetricCard/MetricCard";
import DashboardService from "../../Api.js";
import { toast } from "react-toastify";

function Assignments() {
  const [assignmentsData, setAssignmentsData] = useState({
    totalAssignments: 0,
    successRate: 0,
    activePartners: 0,
    busyPartners: 0,
    offlinePartners: 0,
    avgTime: 0,
    recentAssignments: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await DashboardService.fetchDashboardData();
      setAssignmentsData({
        ...data,
        recentAssignments: Array.isArray(data.recentAssignments)
          ? data.recentAssignments
          : [],
      });
    } catch (error) {
      console.error("Error in fetchData:", error);
      setError("Failed to load assignmenst data");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="p-6 bg-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 bg-gray-100 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
     <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Assignments</h1>
        <button
          onClick={async() => {

            try {
              const data=await DashboardService.assign();
              toast.success("Assigned successfully")
            } catch (error) {
              toast.error("Error Assigning..(No Active partners)")

            }
           
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <RotateCcw className="mr-2" /> Assign
        </button>
      </div>
       
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={TrendingUp}
          label="Total Assignments"
          value={assignmentsData.totalAssignments}
          color="text-blue-500"
        />
        <MetricCard
          icon={CheckCircle}
          label="Success Rate"
          value={
            typeof assignmentsData.successRate === "object"
              ? `${assignmentsData.successRate.successRate} %`
              : `${assignmentsData.successRate} %`
          }
          color="text-green-500"
        />
        <MetricCard
          icon={Users}
          label="Active Partners"
          value={assignmentsData.activePartners}
          color="text-green-500"
        />
        <MetricCard
          icon={Users}
          label="Busy Partners"
          value={assignmentsData.busyPartners}
          color="text-orange-500"
        />
        <MetricCard
          icon={Users}
          label="Offline Partners"
          value={assignmentsData.offlinePartners}
          color="text-black-500"
        />
        <MetricCard
          icon={Package}
          label="Avg. Assign Time"
          value={ assignmentsData?.avgTime && typeof assignmentsData.avgTime === 'object'
            ? `${parseFloat(assignmentsData.avgTime.averageTime || 0).toFixed(3)} mins`
            : `${parseFloat(assignmentsData?.avgTime || 0).toFixed(3)} mins` }
          color="text-orange-500"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4"> Assignments</h2>
        {assignmentsData.recentAssignments.length > 0 ? (
         <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Order ID</th>
                <th className="p-2">Partner ID</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {assignmentsData.recentAssignments.map((assignment) => (
                <tr key={assignment._id} className="border-b">
                  <td className="p-2">{assignment.orderId}</td>
                  <td className="p-2">{assignment.partnerId}</td>
                  <td className="p-2">
                    <span
                      className={`
                        px-2 py-1 rounded 
                        ${
                          assignment.status === "success"
                            ? "bg-green-100 text-green-800"
                            : assignment.status === "failed"
                            ? "bg-yellow-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      `}
                    >
                      {assignment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <div className="text-gray-500">No recent assignments available.</div>
        )}
      </div>
    </div>
  );
}

export default Assignments;
