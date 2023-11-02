import React, { useEffect, useState } from 'react';
import { fetchTickets, fetchUsers } from '../api';
import { BiChevronDown, BiChevronUp,  } from 'react-icons/bi';
import './styles.css';


function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]); // State to store user data
  const [error, setError] = useState(null);
  const [groupingOption, setGroupingOption] = useState(
    localStorage.getItem('groupingOption') || 'status'
  );
  const [sortingOption, setSortingOption] = useState(
    localStorage.getItem('sortingOption') || 'priority'
  );
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  
  useEffect(() => {
    // Fetch tickets data
    fetchTickets()
      .then((ticketsData) => {
        setTickets(ticketsData);
      })
      .catch((error) => {
        setError('Error fetching ticket data: ' + error);
      });

    // Fetch users data
    fetchUsers()
      .then((usersData) => {
        setUsers(usersData);
        console.log(usersData);
      })
      .catch((error) => {
        setError('Error fetching user data: ' + error);
      });
  }, []);



    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e) => {
          if (isDropdownOpen && !e.target.closest('.dropdown-button')) {
            setDropdownOpen(false);
          }
        };
    
        document.addEventListener('click', handleOutsideClick);
    
        return () => {
          document.removeEventListener('click', handleOutsideClick);
        };
      }, [isDropdownOpen]);

      // Save grouping and sorting options to local storage
    useEffect(() => {
        localStorage.setItem('groupingOption', groupingOption);
        localStorage.setItem('sortingOption', sortingOption);
    }, [groupingOption, sortingOption]);


//  // Use useEffect to log updated state values
//  useEffect(() => {
//     console.log('Grouping Option:', groupingOption);
//     console.log('Sorting Option:', sortingOption);
//   }, [groupingOption, sortingOption]);

  // Add functions to handle grouping and sorting options

  const handleGroupingChange = (option) => {
    setGroupingOption(option);
  };

  const handleSortingChange = (option) => {
    setSortingOption(option);
  };

  // Define your grouping and sorting logic here

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Grouping and sorting logic
const groupedAndSortedTickets = () => {
    let groupedTickets = {};
  
    // Group tickets by the selected grouping option (e.g., by status or user)
    tickets.forEach((ticket) => {
      let groupKey;
      if (groupingOption === "user") {
        groupKey = users.find((user) => user.id === ticket.userId)?.name || "Unknown User";
        console.log(groupKey);
      } else {
        groupKey = ticket[groupingOption];
      }
  
      if (!groupedTickets[groupKey]) {
        groupedTickets[groupKey] = [];
      }
      groupedTickets[groupKey].push(ticket);
    });
  
    // Sort the grouped tickets
    for (const groupKey in groupedTickets) {
      groupedTickets[groupKey] = groupedTickets[groupKey].sort((a, b) => {
        if (sortingOption === "priority") {
          return b.priority - a.priority;
        } else if (sortingOption === "title") {
          return a.title.localeCompare(b.title);
        }
      });
    }
  
    return groupedTickets;
  };
  
  const groupedAndSorted = groupedAndSortedTickets();
  

  return (
    <div className='main'>
        <div className={`dropdown-button ${isDropdownOpen ? 'open' : ''}`}>
            <button onClick={() => setDropdownOpen(!isDropdownOpen)}>
            <span className="hamburger-icon">&#9776;</span> Display <span className="dropdown-icon">{isDropdownOpen ? <BiChevronUp /> : <BiChevronDown/>}</span>
            </button>
            {isDropdownOpen && (
            <div className="dropdown">
                <div className='group_by'>
                    <label className='Grouping'>Grouping</label>
                    <select className='select_Grouping' value={groupingOption} onChange={(e) => handleGroupingChange(e.target.value)}>
                        <option value="status">Status</option>
                        <option value="user">User</option>
                        <option value="priority">Priority</option>
                    </select>
                </div>
                <div className='order_by'>
                <label className='Ordering'>Ordering</label>
                <select className='select_Ordering' value={sortingOption} onChange={(e) => handleSortingChange(e.target.value)}>
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                </select>
                </div>
            </div>
            )}
        </div>

        <div className="ticket-card-container">
            {Object.keys(groupedAndSorted).map((groupKey) => (
            <div key={groupKey}>
            <h2>
              {groupingOption === 'user' && Array.isArray(users) && users.length > 0
                ? groupKey
                : groupingOption === 'priority'
                ? `Priority: ${groupKey}`
                : groupKey}
            </h2>

                <ul>
                {groupedAndSorted[groupKey].map((ticket) => (
                    <div key={ticket.id} className="ticket-card">
                    <div className='card_ID'>{ticket.id}</div>
                    <div className='title_ID'>{ticket.title}</div>
                    <div className='feature_priority'>
                        <div>Priority: {ticket.priority}</div>
                        <div className='Feature_ID'>{ticket.tag.join(', ')}</div>
                        </div>
                    </div>
                ))}
                </ul>
            </div>
            ))}
        </div>

    </div>
  );
}

export default TicketList;
