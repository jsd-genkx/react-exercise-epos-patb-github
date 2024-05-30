import { useState } from "react";
import PropTypes from "prop-types";

const Transaction = ({
  transaction,
  updateTransaction,
  deleteTransaction,
  customers,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrderDetails, setEditedOrderDetails] = useState([
    ...transaction.orderDetails,
  ]);
  const [editedDate, setEditedDate] = useState(transaction.date);
  const [editedCustomer, setEditedCustomer] = useState(transaction.customer);

  const handleEditClick = () => {
    setIsEditing(true); // sets isEditing to true
  };

  const handleSaveClick = () => { 
    const updatedTransaction = {
      ...transaction,
      date: editedDate,
      customer: editedCustomer,
      orderDetails: editedOrderDetails,
      grandTotal: editedOrderDetails.reduce(
        (acc, item) => acc + item.unitPrice * item.quantity,
        0
      ),
    };
    updateTransaction(updatedTransaction); // updates transactions array in App to include new properties and values
    setIsEditing(false);
  };

  const handleCancelClick = () => { // resets editedOrderDetails, editedDate, editedCustomer to the value in the transaction object
    setIsEditing(false);
    setEditedOrderDetails([...transaction.orderDetails]);
    setEditedDate(transaction.date);
    setEditedCustomer(transaction.customer);
  };

  const handleQuantityChange = (index, newQuantity) => { // alters editedOrderDetails
    setEditedOrderDetails((prevDetails) =>
      prevDetails.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleDeleteClick = () => {
    if (
      window.confirm(
        `Are you sure you want to delete transaction ${transaction.transactionId}?`
      )
    ) {
      // calls deleteTransaction passed down from App 
      // to filter from the transactions array in App the transaction with the matching ID
      deleteTransaction(transaction.transactionId); 
    }
  };

  return (
    <div className="mb-4 p-2 border bg-[#424242] rounded text-white">
      <h4 className="font-bold">Transaction ID: {transaction.transactionId}</h4>
      {isEditing ? ( 
        <select
          value={editedCustomer}
          onChange={(e) => setEditedCustomer(e.target.value)}
          className="mb-2 p-2 border rounded bg-[#424242]"
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.name}>
              {customer.name}
            </option>
          ))}
        </select>
      ) : (
        <p>Customer: {transaction.customer}</p>
      )}
      {isEditing ? (
        <input
          type="datetime-local"
          value={new Date(editedDate).toISOString().substring(0, 16)}
          onChange={(e) =>
            setEditedDate(new Date(e.target.value).toISOString())
          }
          className="mb-2 w-full text-center border rounded bg-[#424242]"
        />
      ) : (
        <p>Date: {new Date(transaction.date).toLocaleString()}</p>
      )}
      <ul className="list-disc pl-5">
        {isEditing
          ? editedOrderDetails.map((item, index) => (
              <li key={index}>
                {item.name} - ${item.unitPrice} x
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) =>
                    handleQuantityChange(index, parseInt(e.target.value))
                  }
                  className="w-16 text-center border rounded mx-2 bg-[#424242]"
                />
                = ${item.unitPrice * item.quantity}
              </li>
            ))
          : transaction.orderDetails.map((item, index) => (
              <li key={index}>
                {item.name} - {item.quantity} x ${item.unitPrice} = $
                {item.totalPrice}
              </li>
            ))}
      </ul>
      <p className="font-bold">Grand Total: ${transaction.grandTotal}</p>
      {isEditing ? (
        <div className="flex space-x-2 mt-2">
          <button
            className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 cursor-pointer"
            onClick={handleSaveClick} // calls handleSaveClick when clicked
          >
            Save
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-700 cursor-pointer"
            onClick={handleCancelClick} // calls handleCancelClick when clicked
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex space-x-2 mt-2">
          <button
            className="px-4 py-2 bg-yellow-600 text-white font-bold rounded hover:bg-yellow-700 cursor-pointer"
            onClick={handleEditClick} // calls handleEditClick when clicked
          >
            Edit Transaction
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-700 cursor-pointer"
            onClick={handleDeleteClick} // calls handleDeleteClick when clicked
          >
            Delete Transaction
          </button>
        </div>
      )}
    </div>
  );
};

Transaction.propTypes = {
  transaction: PropTypes.shape({
    transactionId: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    customer: PropTypes.string.isRequired,
    orderDetails: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        unitPrice: PropTypes.number.isRequired,
        totalPrice: PropTypes.number.isRequired,
      })
    ).isRequired,
    grandTotal: PropTypes.number.isRequired,
  }).isRequired,
  updateTransaction: PropTypes.func.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Transaction;
