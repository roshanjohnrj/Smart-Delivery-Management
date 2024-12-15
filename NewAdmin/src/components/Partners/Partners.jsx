import React, { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Plus,
  Users,
  Package,
  UsersRound,
  Star,
} from "lucide-react";
import { MetricCard } from "../MetricCard/MetricCard";
import DashboardService from "../../Api.js";
import { toast } from "react-toastify";


function Partners() {
  const [partnersData, setPartnersData] = useState({
    totalPartners: 0,
    activePartners: 0,
    avgRating: 0,
    averageDeliveryTime: 0,
    partnersList: [],
  });

  const [partner, setPartner] = useState({
    name: "",
    email: "",
    phone: "",
    areas: [],
    shift: {
      start: "", // Default start time
      end: "", // Default end time
    },
    shiftType: "", // to store the select ed shift type
    status: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //shift mapping
  const shiftMappings = {
    morning: { start: "09:00", end: "17:00" },
    evening: { start: "17:00", end: "01:00" },
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await DashboardService.fetchDashboardData();
      setPartnersData(data);
    } catch (err) {
      console.error("Error in fetchData:", err);
      setError('Failed to load partner data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [setPartnersData]);

  if (isLoading) {
    return <div className="p-6 bg-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 bg-gray-100 text-red-500">{error}</div>;
  }

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    if (name === "shiftType" && shiftMappings[value]) {
      // When shift is selected, update the start and end times based on shiftMappings
      const Shift = shiftMappings[value];

      setPartner((prevData) => ({
        ...prevData,
        shift: Shift, // Update the shift field with mapped start and end times
        shiftType: value,
      }));
    } else {
      setPartner((prevData) => ({
        ...prevData,
        [name]: value, // Update other fields normally
      }));
    }
  };
  const handleDelete = async (id) => {
    try {
      await DashboardService.deletePartner(id);
      toast.success("Partner deleted successfully!")
    setPartnersData((prevData) => ({
      ...prevData,
      partnersList: prevData.partnersList.filter((partner) => partner._id !== id),
      totalPartners: prevData.totalPartners - 1,
      activePartners: prevData.activePartners - (prevData.partnersList.find((p) => p._id === id)?.status === "active" ? 1 : 0),
    }));
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast.error("Error deleting partner..")
    }
  };

  

  const handleAddEdit = async (partner) => {
    try {
      if (partner._id) {
        // Update existing partner
        await DashboardService.updatePartner(partner);
        toast.success("Partner Updated successfully")
        console.log("Partner updated successfully!");

        // Refresh specific partner data
        setPartnersData((prevData) => ({
          ...prevData,
          partnersList: prevData.partnersList.map((p) =>
            p._id === partner._id ? partner : p
          ),
        }));
      } else {
        // Add a new partner
        if (!partner.name || !partner.email || !partner.status || !partner.areas.length || !partner.shift || !partner.phone) {
          toast.error("Please fill in all required fields.");
          return;
        }
        const newPartner = await DashboardService.addPartner(partner);
        toast.success("Partner added successfully")
        console.log("Partner added successfully!");

        // Update UI
        setPartnersData((prevData) => ({
          ...prevData,
          partnersList: [...prevData.partnersList, newPartner],
          totalPartners: prevData.totalPartners + 1,
          activePartners:
            newPartner.status === "active"
              ? prevData.activePartners + 1
              : prevData.activePartners,
        }));
      }

      // let isMounted = true;
      // fetchData();

      // Close modal
      setShowModal(false);

      // Reset the partner state
      setPartner({
        name: "",
        email: "",
        phone: "",
        areas: [],
        shift: {
          start: "",
          end: "",
        },
        shiftType: "",
        status: "",
      });
    } catch (error) {
      toast.error("Something went wrong while adding or Updating data")
      console.error("Error in handleAddEdit:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Delivery Partners</h1>
        <button
          onClick={() => {
            setPartner({});
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center "
        >
          <Plus className=" mr-2" /> Add Partner
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={UsersRound}
          label="Total Partners"
          value={partnersData?.totalPartners || 0}
          color="text-blue-500"
        />
        <MetricCard
          icon={Users}
          label="Active Partners"
          value={partnersData?.activePartners || 0}
          color="text-green-500"
        />
        <MetricCard
          icon={Star}
          label="Average Rating"
          value={partnersData?.avgRating || 0}
          color="text-purple-500"
        />
        <MetricCard
          icon={Package}
          label="Avg. Delivery Time"
          value={partnersData?.averageDeliveryTime || 0}
          color="text-orange-500"
        />
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Current Load</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partnersData?.partnersList?.map((partner) => (
              <tr key={partner._id || partner.email} className="border-b">
                <td className="p-3">{partner.name}</td>
                <td className="p-3">{partner.email}</td>
                <td className="p-3">
                  <span
                    className={`
                      px-2 py-1 rounded 
                      ${
                        partner.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    `}
                  >
                    {partner.status}
                  </span>
                </td>
                <td className="p-3">{partner.currentLoad}/3</td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setPartner(partner);
                        setShowModal(true);
                      }}
                      className="text-blue-500 hover:bg-blue-100 p-1 rounded"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(partner._id)}
                      className="text-red-500 hover:bg-red-100 p-1 rounded"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modal for Add and Edit Partner */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h2 className="text-2xl mb-4">
              {partner && partner._id ? "Edit Partner" : "Add New Partner"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={partner.name || ""}
                onChange={onChangeHandler}
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={partner.email || ""}
                onChange={onChangeHandler}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Phone"
                name="phone"
                value={partner.phone || ""}
                onChange={onChangeHandler}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Areas"
                name="areas"
                value={partner.areas || ""}
                onChange={(e) =>
                  setPartner((prev) => ({
                    ...prev,
                    areas: e.target.value.split(","),
                  }))
                }
                className="w-full p-2 border rounded"
              />
              <div className="flex space-x-4">
                <select
                  name="shiftType"
                  value={partner.shiftType || ""}
                  onChange={onChangeHandler}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Shift</option>
                  <option value="morning">Morning</option>
                  <option value="evening">Evening</option>
                </select>
                <select
                  name="status"
                  value={partner.status}
                  onChange={onChangeHandler}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setPartner();
                }}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddEdit(partner)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {partner._id ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Partners;
