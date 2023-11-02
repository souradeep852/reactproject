export const fetchTickets = async () => {
    try {
      const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
      const data = await response.json();
      
      if (data && data.tickets && Array.isArray(data.tickets)) {
        return data.tickets;
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (error) {
      throw error;
    }
  };
  
  
  export const fetchUsers = async () => {
    try {
      const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
      const data = await response.json();
      if (data && data.users && Array.isArray(data.users)) {
        return data.users;
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (error) {
      throw error;
    }
  };
  