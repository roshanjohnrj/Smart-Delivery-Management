import React, { useEffect, useState } from "react";
import { MetricCard } from "../MetricCard/MetricCard";
import DashboardService from "../../Api.js";
import { CheckCircle, Package, Boxes, Plus } from "lucide-react";
import { toast } from "react-toastify";


function Orders() {
  const [ordersData, setOrdersData] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    ordersList: [],
  });

  const [order, setOrder] = useState({
    orderNumber: "",
    customer: {
      name: "",
      phone: "",
      address: "",
    },
    area: "",
    items: [
      {
        name: "",
        quantity: "",
        price: "",
      },
    ],
  });
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await DashboardService.fetchDashboardData();
      const orders = await DashboardService.fetchOrdersData();
      if (!data || !orders) {
        setError('Invalid response data');
        return;
      }
      setOrdersData((prev) => ({
        ...data,
        ordersList: Array.isArray(orders) ? orders : [],
      }));
    } catch (err) {
      console.error("Error in fetchData:", err);
      setError("Failed to load Orders data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onChangeHandler = (event, index = null) => {
    const { name, value } = event.target;
  
    if (index !== null) {
      // Update the corresponding item based on index
      const updatedItems = [...order.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: value,  // Update the field (name, quantity, or price)
      };
      setOrder((prevData) => ({
        ...prevData,
        items: updatedItems,  // Update the items array in state
      }));
    } else {
      // Update the customer field
      if (["name", "phone", "address"].includes(name)) {
        setOrder((prevData) => ({
          ...prevData,
          customer: {
            ...prevData.customer,
            [name]: value,  // Update the customer field (name, phone, or address)
          },
        }));
      } else {
        // Update other non-customer fields in the order object
        setOrder((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };
  

  const handleAdd = async (order) => {
    try {
      const newOrder = await DashboardService.addOrder(order);
      setShowModal(false);
      toast.success("Order Added successfully")
      setOrder();
      setOrdersData((prevData) => ({
        ...prevData,
        ordersList: [...prevData.ordersList, newOrder],
        totalOrders: prevData.totalOrders + 1,
        activeOrders: ["assigned", "picked"].includes(newOrder.status)
          ? prevData.activeOrders + 1
          : prevData.activeOrders,
      }));
    } catch (err) {
      toast.error("Error adding order")
      console.error("Error adding order:", err);
      setError("Failed to add order");
    }
  };

  if (isLoading) {
    return <div className="p-6 bg-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 bg-gray-100 text-red-500">{error}</div>;
  }

  // Function to add a new empty item to the items array
  const addItem = () => {
    setOrder((prevData) => ({
      ...prevData,
      items: Array.isArray(prevData.items)
        ? [
            ...prevData.items,
            {
              name: "",
              quantity: "",
              price: "",
            },
          ]
        : [
            {
              name: "",
              quantity: "",
              price: "",
            },
          ],
    }));
  };

// Function to remove an item from the items array based on index
const removeItem = (index) => {
  setOrder((prevData) => ({
    ...prevData,
    items: Array.isArray(prevData.items)
      ? prevData.items.filter((_, i) => i !== index)
      : [],
  }));
};

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <button
          onClick={() => {
            setOrder({});
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="mr-2" /> Add Order
        </button>
      </div>

      {/* metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={Boxes}
          label="Total Orders"
          value={ordersData.totalOrders}
          color="text-blue-500"
        />
        <MetricCard
          icon={Package}
          label="Active Orders"
          value={ordersData.activeOrders}
          color="text-green-500"
        />
        <MetricCard
          icon={CheckCircle}
          label="Completed Orders"
          value={ordersData.completedOrders}
          color="text-green-500"
        />
        <MetricCard
          icon={Package}
          label="CancelledOrders"
          value={ordersData.cancelledOrders}
          color="text-red-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Partner ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {ordersData.ordersList.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="p-3">{order._id}</td>
                <td className="p-3">
                  {["assigned", "picked", "delivered"].includes(order.status)
                    ? order.assignedTo
                    : "Not assigned"}
                </td>
                <td className="p-3">{order.customer.name}</td>
                <td className="p-3">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>  
      </div>
      {/* Modal for Add and Edit Partner */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg  w-10/12 sm:w-1/2 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl mb-4">
              {/* {order._id ? "Edit Partner" : "Add New Partner"} */}
              Add New Order
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Order Number"
                name="orderNumber"
                value={order.orderNumber || ""}
                onChange={onChangeHandler}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder=" customer Name"
                name="name"
                value={order.customer?.name || ""}
                onChange={onChangeHandler}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Phone"
                name="phone"
                value={order.customer?.phone || ""}
                onChange={onChangeHandler}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Address"
                name="address"
                value={order.customer?.address || ""}
                onChange={onChangeHandler}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Area"
                name="area"
                value={order.area || ""}
                onChange={onChangeHandler}
                className="w-full p-2 border rounded"
              />
              {/* Items Section */}
              {Array.isArray(order.items) && order.items.map((item, index) => (
                <div key={index} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Item Name"
                    name="name"
                    value={item.name || ""}
                    onChange={(e) => onChangeHandler(e, index)}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    name="quantity"
                    value={item.quantity || ""}
                    onChange={(e) => onChangeHandler(e, index)}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    name="price"
                    value={item.price || ""}
                    onChange={(e) => onChangeHandler(e, index)}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Remove Item
                  </button>
                </div>
              ))}
              <button
                onClick={addItem}
                className="bg-green-500 text-white px-4 py-2 rounded mt-4"
              >
                Add Item
              </button>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setOrder();
                }}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAdd(order)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {/* {order._id ? "Update" : "Add"} */}
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
