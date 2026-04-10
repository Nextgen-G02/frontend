import React, { useState } from "react";

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  // Add Item
  const addItem = () => {
    if (!itemName || !quantity || !price) {
      alert("Please fill all fields");
      return;
    }

    const newItem = {
      name: itemName,
      quantity: quantity,
      price: price,
    };

    setInventory([...inventory, newItem]);

    setItemName("");
    setQuantity("");
    setPrice("");
  };

  // Delete Item
  const deleteItem = (index) => {
    const updated = inventory.filter((_, i) => i !== index);
    setInventory(updated);
  };

  return (
    <div style={styles.container}>
      <h1>Inventory Management 🍰</h1>

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button onClick={addItem}>Add Item</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {inventory.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td>
                <button onClick={() => deleteItem(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Simple styles
const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  form: {
    marginBottom: "20px",
  },
  table: {
    margin: "auto",
    borderCollapse: "collapse",
    width: "70%",
  },
};

export default InventoryManagement;