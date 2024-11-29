import React, { useState, useEffect } from "react";
import ShopForm from './ShopForm'


function AddOrder() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [excelData, setExcelData] = useState(null);

  useEffect(() => {
    // Retrieve data from local storage on component mount
    const storedData = localStorage.getItem("excelData");
    if (storedData) {
      setExcelData(JSON.parse(storedData));
    }
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (excelData) {
      const filtered = excelData.filter((item) =>
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
    setSearchTerm(Object.values(option).join(", "));
    setFilteredOptions([]);
  };

  return (
    
    <div>
      <ShopForm/>
    </div>

  );
}

export default AddOrder;
