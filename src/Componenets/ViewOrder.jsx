import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

const ViewOrder = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("shops")) || [];
    setOrders(storedOrders);
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Orders List", 14, 20);
    const tableData = [];
    orders.forEach((order) => {
      order.items.forEach((item, index) => {
        tableData.push([
          index === 0 ? order.shopName : "",
          item.itemName,
          item.quantity,
          item.amount || "",
          item.notes || ""  // Add the note to the PDF export
        ]);
      });
    });
    doc.autoTable({
      head: [["Shop Name", "Item Name", "Quantity", "Amount", "Note"]],
      body: tableData,
      startY: 30,
    });
    doc.save("orders.pdf");
  };

  const resetOrders = () => {
    const confirmation = window.confirm(
      "Are you sure you want to reset all orders? Navigate to home.."
    );
    if (confirmation) {
      localStorage.removeItem("shops");
      setOrders([]);
      navigate('/home');
    }
  };

  const addOrder = () => {
    navigate("/addorder");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center sm:text-left"> Orders</h2>
      {orders.length > 0 ? (
        <>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg mb-6">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-gray-600 border-r border-gray-200">
                    Customer Name
                  </th>
                  <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-gray-600 border-r border-gray-200">
                    Item Name
                  </th>
                  <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-gray-600 border-r border-gray-200">
                    Quantity
                  </th>
                  <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-gray-600 border-r border-gray-200">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-gray-600">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <React.Fragment key={index}>
                    {order.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className="border-t border-gray-200">
                        {itemIndex === 0 && (
                          <td
                            rowSpan={order.items.length}
                            className="py-3 px-4 text-center text-xs sm:text-sm font-semibold text-gray-700 border-r border-gray-200"
                          >
                            {order.shopName}
                          </td>
                        )}
                        <td className="py-3 px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-200">
                          {item.itemName}
                        </td>
                        <td className="py-3 px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-200">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-200">
                          {item.amount || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-xs sm:text-sm text-gray-700">
                          {item.notes || "N/A"}  {/* Display the note */}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-4 sm:gap-6">
            <button
              onClick={addOrder}
              className="mt-6 px-6 py-2 w-full text-green-600 hover:text-green-800 font-semibold transition-all transform hover:scale-105"
            >
              Add Order
            </button>
            <div className="flex justify-between gap-4 sm:gap-6">
              <button
                onClick={resetOrders}
                className="bg-red-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition w-full sm:w-auto"
              >
                Reset Orders
              </button>
              <button
                onClick={exportToPDF}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition w-full sm:w-auto"
              >
                Export to PDF
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600 mt-6">No orders found!</p>
      )}
    </div>
  );
};

export default ViewOrder;
