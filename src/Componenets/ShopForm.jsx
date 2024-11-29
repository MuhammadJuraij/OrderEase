import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ShopForm = () => {
  const navigate = useNavigate();

  const [shopName, setShopName] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [excelData, setExcelData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("fileData");
    if (storedData) {
      setExcelData(JSON.parse(storedData));
    }
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  
    if (!value.trim()) {
      setFilteredOptions([]);
      return;
    }
  
    if (excelData && excelData.length > 0) {
      // Flattening all data tables into a single array
      const allData = excelData.flatMap((table) => table.data); 
  
      // Filtering the flattened data
      const filtered = allData.filter((item) =>
        Object.values(item).some((v) =>
          v.toString().toLowerCase().includes(value.toLowerCase())
        )
      );
  
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  };
  
  const handleSelectOption = (option) => {
    console.log('Option:', option);  // Debugging line to inspect the option object
  
    // Check if 'Facts code' exists and fallback to 'Unknown' if missing
    const factsCode = option["Facts code"] || "Unknown"; 
    const description = option.Description || "Unknown"; 
    const code = option.Code || "Unknown"; 
  
    const selectedItem = `${factsCode} - ${code} - ${description}`;
    setItem(selectedItem);
    setSearchTerm(selectedItem);
    setFilteredOptions([]);
  };
  
  
  const handleAddItem = (e) => {
    e.preventDefault();

    if (!item || !quantity) {
      alert("Please fill in both item name and quantity.");
      return;
    }

    const newItem = { itemName: item, quantity, amount, note };
    if (editIndex !== null) {
      const updatedItems = [...items];
      updatedItems[editIndex] = newItem;
      setItems(updatedItems);
      setEditIndex(null);
    } else {
      setItems([...items, newItem]);
    }

    setItem("");
    setQuantity("");
    setAmount("");
    setNote("");
    setSearchTerm("");
  };

  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleEditItem = (index) => {
    const itemToEdit = items[index];
    setItem(itemToEdit.itemName);
    setQuantity(itemToEdit.quantity);
    setAmount(itemToEdit.amount || "");
    setNote(itemToEdit.note || "");
    setEditIndex(index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!shopName || items.length === 0) {
      alert("Please fill in the shop name and add at least one item.");
      return;
    }

    const storeData = {
      shopName,
      items,
    };

    const existingData = JSON.parse(localStorage.getItem("orderdata")) || [];
    localStorage.setItem("orderdata", JSON.stringify([...existingData, storeData]));

    alert("Store data saved successfully!");

    setShopName("");
    setItems([]);
    setEditIndex(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-white py-16">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700">Customer</label>
            <input
              type="text"
              placeholder="Enter customer name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative col-span-1 lg:col-span-2">
              <label className="block text-lg font-semibold text-gray-700">Search Item</label>
              <input
                type="text"
                placeholder="Search or select an item..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {filteredOptions.length > 0 && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                  {filteredOptions.map((option, index) => (
                    <div
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSelectOption(option)}
                    >
                      {option.Description || option.Code || option["Facts code"]}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="col-span-1 lg:col-span-1">
              <label className="block text-lg font-semibold text-gray-700">Quantity</label>
              <input
                type="text"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div className="col-span-1 lg:col-span-1">
              <label className="block text-lg font-semibold text-gray-700">Amount (Optional)</label>
              <input
                type="text"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div className="col-span-1 lg:col-span-1">
              <label className="block text-lg font-semibold text-gray-700">Note (Optional)</label>
              <textarea
                placeholder="Enter note..."
                value={note}
                rows="1"
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleAddItem}
              className="w-full px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transform transition-all"
            >
              {editIndex !== null ? "Save Item" : "Add Item +"}
            </button>
          </div>
        </form>

        {items.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full table-auto border-collapse">
  <thead>
    <tr>
      <th className="px-6 py-3 text-left text-lg font-medium text-gray-700 border-b">Item Name</th>
      <th className="px-6 py-3 text-left text-lg font-medium text-gray-700 border-b">Quantity</th>
      <th className="px-6 py-3 text-left text-lg font-medium text-gray-700 border-b">Amount</th>
      <th className="px-6 py-3 text-left text-lg font-medium text-gray-700 border-b">Note</th>
      <th className="px-6 py-3 text-left text-lg font-medium text-gray-700 border-b">Actions</th>
    </tr>
  </thead>
  <tbody>
    {items.map((item, index) => (
      <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
        <td className="px-6 py-3 text-gray-700">{item.itemName}</td>
        <td className="px-6 py-3 text-gray-700">{item.quantity}</td>
        <td className="px-6 py-3 text-gray-700">{item.amount}</td>
        <td className="px-6 py-3 text-gray-700">{item.note}</td>
        <td className="px-6 py-3 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <button
            onClick={() => handleEditItem(index)}
            className="w-full sm:w-auto px-3 py-2 text-sm bg-yellow-500 text-white rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-transform"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteItem(index)}
            className="w-full sm:w-auto px-3 py-2 text-sm bg-red-600 text-white rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-transform"
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

          </div>
        )}

        <div className="mt-8">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white font-bold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transform transition-all"
          >
            Submit Order
          </button>

          {/* View Orders Button */}
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

export default ShopForm;
