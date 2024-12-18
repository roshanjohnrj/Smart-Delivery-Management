import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

class DashboardService {

    async fetchDashboardData() {
      // const backendUrl = import.meta.env.VITE_BACKEND_URL;
      try {
        const response = await axios.get(`${backendUrl}/api/dashboard`);
        // console.log(response.data)
        return response.data; 
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }
    
    async displayPartners(){
      const response=await axios.get(`${backendUrl}/api/partners/display`);
      return response.data.data;
    }

    async addPartner(partner){
      const response = await axios.post(`${backendUrl}/api/partners/register`, partner);
      return response.data.data;
    }

    async updatePartner(partner){
      const response = await axios.put(`${backendUrl}/api/partners/update/${partner._id}`, partner);
      return response.data.data;
    }

    async deletePartner(id){
      const response = await axios.delete(`${backendUrl}/api/partners/delete/${id}`);
      return response.data;
    }
  
    //orders
    async fetchOrdersData(){
      const response = await axios.get(`${backendUrl}/api/orders/display`);
      // console.log(response.data.data)
      return response.data.data;
    }

    async addOrder(order){
      const response=await axios.post(`${backendUrl}/api/orders/create`,order);
      return response.data.data
    }

    async updateOrder(id,order){
      const response=await axios.put(`${backendUrl}/api/orders/update/${id}`,order)
      return response.data.data
    }
    
    async deleteOrder(id){
      const response=await axios.delete(`${backendUrl}/api/orders/delete/${id}`)
      return response.data.message
    }

    async updateOrderStatus(id,status){
      const response=await axios.put(`${backendUrl}/api/orders/status/${id}`,status)
    }
    //assigments
    async assign(){
      const response=await axios.post(`${backendUrl}/api/assignments/run`)
      return response.data.data
    }


}

export default new DashboardService();