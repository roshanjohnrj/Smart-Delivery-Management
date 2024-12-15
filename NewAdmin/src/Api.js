import axios from 'axios';

class DashboardService {

 
    async fetchDashboardData() {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/dashboard`);
        console.log(response.data)
        return response.data; 
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }
    
    async displayPartners(){
      const response=await axios.get('/api/partners/display');
      return response.data.data;
    }

    async addPartner(partner){
      const response = await axios.post(`/api/partners/register`, partner);
      return response.data.data;
    }

    async updatePartner(partner){
      const response = await axios.put(`/api/partners/update/${partner._id}`, partner);
      return response.data.data;
    }

    async deletePartner(id){
      const response = await axios.delete(`/api/partners/delete/${id}`);
      return response.data;
    }
  
    //orders
    async fetchOrdersData(){
      const response = await axios.get(`/api/orders/display`);
      console.log(response.data.data)
      return response.data.data;
    }

    async addOrder(order){
      const response=await axios.post(`/api/orders/create`,order);
      return response.data.data
    }
    
    //assigments
    async assign(){
      const response=await axios.post(`/api/assignments/run`)
      return alert(response.data)
    }


}

export default new DashboardService();