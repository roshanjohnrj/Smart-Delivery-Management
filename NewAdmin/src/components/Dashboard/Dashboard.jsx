import React, { useEffect, useState } from 'react';
import { Users, Package, Clipboard, TrendingUp, CheckCircle } from 'lucide-react';
import { MetricCard } from '../MetricCard/MetricCard';
import DashboardService from "../../Api.js"

function Dashboard() {

  const [dashboardData,setDashboardData]=useState({
    activePartners: 0,
    totalOrders: 0,
    completedOrders: 0,
    avgTime:0,
    recentAssignments: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted=true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await DashboardService.fetchDashboardData();
        if(isMounted) setDashboardData(data);
      } catch (err) {
        console.error("Error in fetchData:", err);
        if(isMounted) setError('Failed to load dashboard data');
      } finally {
        if(isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <div className="p-6 bg-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 bg-gray-100 text-red-500">{error}</div>;
  }

  
    return (
      <div className="p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Delivery Dashboard</h1>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={TrendingUp} 
            label="Total Orders" 
            value={dashboardData?.totalOrders || 0} 
            color="text-blue-500" 
          />
          <MetricCard 
            icon={CheckCircle} 
            label="Completed Orders" 
            value={dashboardData?.completedOrders || 0} 
            color="text-green-500" 
          />
          <MetricCard 
            icon={Users} 
            label="Active Partners" 
            value={dashboardData?.activePartners || 0} 
            color="text-purple-500" 
          />
          <MetricCard 
            icon={Package} 
            label="Avg. Assign Time" 
            value={ dashboardData?.avgTime && typeof dashboardData.avgTime === 'object'
              ? `${parseFloat(dashboardData.avgTime.averageTime || 0).toFixed(3)} mins`
              : `${parseFloat(dashboardData?.avgTime || 0).toFixed(3)} mins`} 
            color="text-orange-500" 
          />
        </div>
  
        {/* Recent Assignments */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Assignments</h2>
          {dashboardData.recentAssignments.length >0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Order ID</th>                
                <th className="p-2">Partner ID</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentAssignments.map((assignment) => (
                <tr key={assignment._id} className="border-b">
                  <td className="p-2">{assignment.orderId}</td>
                  <td className="p-2">{assignment.partnerId}</td>
                  <td className="p-2">
                    <span 
                      className={`
                        px-2 py-1 rounded 
                        ${assignment.status === 'success' ? 'bg-green-100 text-green-800' : 
                          assignment.status === 'failed' ? 'bg-yellow-100 text-red-800' : 
                          'bg-blue-100 text-blue-800'}
                      `}
                    >
                      {assignment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ):(
         
            <div className="text-gray-500">No recent assignments available.</div>

          
          )}
        </div>
      </div>
    );
  }
  

export default Dashboard
