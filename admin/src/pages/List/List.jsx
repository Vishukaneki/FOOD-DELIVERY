import React, { useEffect, useState } from 'react'
import './List.css'
import { toast } from 'react-toastify' 
import axios from 'axios'

const List = ({URL}) => {
  
  // Renamed to avoid potential browser conflicts
  const apiUrl = URL
  const [list, setList] = useState([])

  const fetchList = async () => {
    // Added try...catch for error handling
    try {
      const response = await axios.get(`${apiUrl}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data)
      } else {
        toast.error('Error: Failed to fetch list');
      }
    } catch (error) {
      console.error("Fetch list error:", error);
      toast.error('Server error, please try again later');
    }
  }

  // Renamed function (typo fix)
  const removeFood = async (foodId) => {
    // Added try...catch for error handling
    try {
      // Assuming a POST request as it's safer for passing IDs
      const response = await axios.post(`${apiUrl}/api/food/remove`, { id: foodId }); 
      
      // Added success/error feedback for the delete action
      if (response.data.success) {
        toast.success(response.data.message || 'Food removed successfully');
        await fetchList(); // Refetch the list *after* success
      } else {
        toast.error(response.data.message || 'Failed to remove food');
      }
    } catch (error) {
      console.error("Remove food error:", error);
      toast.error('Server error, please try again later');
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item) => {
          return (
            // Changed key from index to the unique item._id
            <div key={item._id} className='list-table-format'>
              <img src={`${apiUrl}/images/${item.image}`} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p> {/* Added $ for clarity */}
              <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default List