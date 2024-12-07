import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

const ViewOrder = () => {
  const [orders, setOrders] = useState([]);
  const [userNote, setUserNote] = useState("");  // To store the user input note
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("shops")) || [];
    setOrders(storedOrders);
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
  
    // Set custom font and add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Orders List", 14, 20);
  
    const tableData = [];
  
    // Loop through orders to format the data
    orders.forEach((order) => {
      order.items.forEach((item, index) => {
        tableData.push([
          index === 0 ? order.shopName : "", // Merge cells for shopName
          item.itemName,
          item.quantity,
          item.amount || "",
          item.notes || "",
        ]);
      });
    });
  
    // Add an empty row for spacing
    tableData.push(["", "", "", "", ""]);
  
    // Add user note with colspan styling
    tableData.push([
      { content: userNote, colSpan: 5, styles: { halign: "left", fontStyle: "italic" } },
    ]);
  
    // Customize the table
    doc.autoTable({
      head: [["Customer Name", "Item Name", "Quantity", "Amount", "Note"]], // Header row
      body: tableData,
      startY: 30, // Position below the title
      theme: "grid", // Use grid theme (other options: striped, plain)
      headStyles: {
        fillColor: [22, 160, 133], // Green header background
        textColor: 255, // White text
        fontSize: 12, // Header font size
        halign: "center", // Center align header text
      },
      bodyStyles: {
        textColor: [60, 60, 60], // Dark gray text
        fontSize: 10, // Body font size
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light gray for alternate rows
      },
      styles: {
        cellPadding: 4, // Cell padding
        lineColor: [44, 62, 80], // Border color
        lineWidth: 0.5, // Border width
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Set column width for "Customer Name"
        1: { cellWidth: 70 }, // Increased width for "Item Name"
        2: { cellWidth: 25, halign: "center" }, // Slightly increased width for "Quantity"
        3: { cellWidth: 25, halign: "center" }, // Slightly increased width for "Amount"
        4: { cellWidth: 40 }, // Set column width for "Note"
      },
    });
  
    // Save the PDF
    doc.save("orders.pdf");
  };
  

  const resetOrders = () => {
    const confirmation = window.confirm(
      "Are you sure you want to reset all orders? Navigate to home.."
    );
    if (confirmation) {
      localStorage.removeItem("shops");
      setOrders([]);
      navigate("/home");
    }
  };

  const addOrder = () => {
    navigate("/addorder");
  };

  const handleNoteChange = (e) => {
    setUserNote(e.target.value); // Update the note input value
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center sm:text-left">
        Orders
      </h2>
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
                          {item.notes || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Row for submitting user note */}
          <div className="mb-4">
            <label htmlFor="userNote" className="block text-gray-600 font-medium">
              Add a Note:
            </label>
            <textarea
              id="userNote"
              value={userNote}
              onChange={handleNoteChange}
              className="w-full mt-2 p-3 border rounded-md border-gray-300"
              rows="4"
              placeholder="Enter a note for the order..."
            />
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
