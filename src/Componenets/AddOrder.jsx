import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Addorder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fileData, setFileData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [orderData, setOrderData] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(true);  // State to control dropdown visibility
  const [editingIndex, setEditingIndex] = useState(null); // State to track the editing row index

  const navigate=useNavigate();

  // Load file data from localStorage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("fileData"));
    if (storedData) {
      setFileData(storedData); // Load corresponding file data
    }
  }, []);

  // Filter data based on search term
  useEffect(() => {
    const newFilteredData = fileData.map((file) => ({
      ...file,
      data: file.data.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(String(searchTerm).toLowerCase())
        )
      ),
    }));
    setFilteredData(newFilteredData);
  }, [searchTerm, fileData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value || '');
    setSelectedItem(null); // Reset selected item when typing
    setIsDropdownVisible(true); // Ensure dropdown is visible while typing
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    // Update to only include the first four columns
    const itemDetails = Object.values(item).slice(0, 3).join(', ');
    setSearchTerm(itemDetails); // Populate input field with the selected item details
    setIsDropdownVisible(false); // Hide dropdown when an item is selected
  };
  

  const handleAddRow = () => {
    if (!customerName || !quantity || !selectedItem) {
      alert('Please fill in all fields');
      return;
    }

    const newRow = {
      customerName,
      selectedItem: selectedItem,
      quantity,
      amount,
      notes,
    };

    // Add new row to order data or update existing row if in editing mode
    if (editingIndex !== null) {
      const updatedData = [...orderData];
      updatedData[editingIndex] = newRow;
      setOrderData(updatedData);
      setEditingIndex(null); // Clear editing state after updating
    } else {
      setOrderData((prevData) => [...prevData, newRow]);
    }

    // Reset the form for item fields but keep customer name
    resetItemFields();
  };

  const resetItemFields = () => {
    setQuantity('');
    setAmount('');
    setNotes('');
    setSelectedItem(null);
    setSearchTerm(''); // Reset the search term after adding a row
    setIsDropdownVisible(true); // Show the dropdown again after clearing fields
  };

  const handleDeleteRow = (index) => {
    const updatedData = orderData.filter((_, i) => i !== index);
    setOrderData(updatedData);
  };

  const handleEditRow = (index) => {
    const row = orderData[index];
    setCustomerName(row.customerName);
    setQuantity(row.quantity);
    setAmount(row.amount);
    setNotes(row.notes);
    setSelectedItem(row.selectedItem);
    setSearchTerm(Object.values(row.selectedItem).join(', ')); // Set the selected item name in the search
    setEditingIndex(index); // Set the index to edit
  };

  const handleSubmit = () => {
    if (orderData.length > 0) {
      // Get existing customer data from localStorage
      const storedShops = JSON.parse(localStorage.getItem('shops')) || [];

      // Find the shop by name (e.g., using customerName as shopName)
      const existingShopIndex = storedShops.findIndex(shop => shop.shopName === customerName);

      const items = orderData.map(order => ({
        itemName: Object.values(order.selectedItem).slice(0, 3).join(', '),
  // Joining selected item details as item name
        quantity: order.quantity,
        amount: order.amount,
        notes: order.notes,
      }));

      if (existingShopIndex >= 0) {
        // If shop exists, add the new items to their existing items list
        storedShops[existingShopIndex].items.push(...items);
      } else {
        // If shop doesn't exist, create a new shop with the items
        storedShops.push({
          shopName: customerName,
          items: items,
        });
      }

      // Save updated shop data back to localStorage
      localStorage.setItem('shops', JSON.stringify(storedShops));
      alert('Orders saved !');

      // Optionally reset the customer name after submit
      setCustomerName('');
      setOrderData([]); // Clear the order data after submit
    } else {
      alert('No order data to save!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-white py-16">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div className="space-y-6">
          {/* Customer Name */}
          <div>
            <label className="block text-lg font-semibold text-gray-700">Customer Name</label>
            <input
              type="text"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Search Item */}
          <div className="relative">
            <label className="block text-lg font-semibold text-gray-700">Search Item</label>
            <input
              type="text"
              placeholder="Search Item..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            {isDropdownVisible && searchTerm && filteredData.length > 0 && (
              <ul className="absolute bg-white shadow-lg w-full mt-1 rounded-md z-10 max-h-60 overflow-y-auto border border-gray-300">
                {filteredData.map((file, index) => (
                  <li key={index} className="px-4 py-2 hover:bg-gray-100">
                    <strong>{file.name}</strong>
                    <ul>
                      {file.data.map((row, rowIndex) => (
                        <li
                          key={rowIndex}
                          onClick={() => handleSelectItem(row)}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        >
                          {Object.values(row).map((value, colIndex) => (
                            <span key={colIndex}>{value} </span>
                          ))}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Selected Item Details
          {selectedItem && (
            <div className="selected-item-details">
              <h3 className="text-xl font-semibold">Selected Item:</h3>
              <pre>{Object.values(selectedItem).join(', ')}</pre>
            </div>
          )} */}

          {/* Quantity, Amount, and Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-semibold text-gray-700">Quantity</label>
              <input
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700">Amount (optional)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-lg font-semibold text-gray-700">Notes (optional)</label>
            <textarea
              placeholder="Enter notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Add/Update Order Button */}
          <button
            type="button"
            onClick={handleAddRow}
            className="w-full p-3 mt-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            {editingIndex !== null ? 'Update Order' : 'Add Order'}
          </button>

          {/* Order Table */}
          {orderData.length > 0 && (
            <div className="mt-8 overflow-x-auto">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <table className="w-full mt-4 table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">Customer</th>
                    <th className="border p-2 text-left">Item</th>
                    <th className="border p-2 text-left">Quantity</th>
                    <th className="border p-2 text-left">Amount</th>
                    <th className="border p-2 text-left">Notes</th>
                    <th className="border p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.map((row, index) => (
                    <tr key={index}>
                      <td className="border p-2">{row.customerName}</td>
                      <td className="border p-2">{Object.values(row.selectedItem).slice(0, 3).join(', ')}</td>
                      <td className="border p-2">{row.quantity}</td>
                      <td className="border p-2">{row.amount}</td>
                      <td className="border p-2">{row.notes}</td>
                      <td className="border p-2">
                        <button onClick={() => handleEditRow(index)} className="text-blue-500 mr-2">Edit</button>
                        <button onClick={() => handleDeleteRow(index)} className="text-red-500">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full p-3 mt-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Save Orders
          </button>
          <button
          onClick={() => navigate("/vieworder")}
          className="mt-6 px-6 py-2 w-full text-green-600 hover:text-green-800 font-semibold transition-all transform hover:scale-105"
        >
          View Orders
        </button>
        </div>
      </div>
    </div>
  );
};

export default Addorder;
