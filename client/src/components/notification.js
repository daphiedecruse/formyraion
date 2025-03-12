import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Fetch unread notifications from API
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    
    fetchNotifications();

    // Listen for real-time notifications
    socket.on("notification", (message) => {
      setNotifications((prev) => [...prev, message]);
    });

    return () => {
      socket.off("notification");
    };
  }, [userId]);

  // Mark notifications as read
  const markAsRead = async () => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${userId}/markAsRead`);
      setNotifications([]);
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button 
        className="relative p-2 text-xl" 
        onClick={() => {
          setIsOpen(!isOpen);
          markAsRead();
        }}
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-3">
          <h3 className="text-lg font-bold">Notifications</h3>
          <ul>
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <li key={index} className="border-b py-2">
                  {notif.message}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No new notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;
