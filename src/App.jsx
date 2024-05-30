import { useState } from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import TransactionList from "./components/TransactionList";
import customers from "./data/customers";
import products from "./data/products";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState(customers[0].id);

  const addToCart = (productId, isMultiple, quantity = 1) => {
    const product = products.find((p) => p.id === productId);
    const quantityToAdd = isMultiple ? parseInt(quantity, 10) : 1;

    setCartItems((prevCartItems) => {
      const existingItem = prevCartItems.find((item) => item.id === productId);
      if (existingItem) {
        return prevCartItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      } else {
        return [...prevCartItems, { ...product, quantity: quantityToAdd }];
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const checkout = () => {
    const customer = customers.find((c) => c.id === selectedCustomer);
    const transactionId = Date.now();
    const date = new Date().toISOString();
    const orderDetails = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.price * item.quantity,
    }));
    const grandTotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const transaction = {
      transactionId,
      date,
      orderDetails,
      grandTotal,
      customer: customer.name,
    };
    setTransactions((prevTransactions) => [...prevTransactions, transaction]);
    clearCart();
  };

  const updateTransaction = (updatedTransaction) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.transactionId === updatedTransaction.transactionId
          ? updatedTransaction
          : transaction
      )
    );
  };

  const deleteTransaction = (transactionId) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter(
        (transaction) => transaction.transactionId !== transactionId
      )
    );
  };

  const calculateSales = (filterFn) => {
    return transactions
      .filter(filterFn)
      .reduce((acc, transaction) => acc + transaction.grandTotal, 0);
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isThisWeek = (date) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Get the day of the week (0 for Sunday, 1 for Monday, etc.)

    // Adjust so that 0 is Monday, 6 is Sunday
    const adjustedDayOfWeek = (dayOfWeek + 6) % 7;

    const firstDayOfWeek = today.getDate() - adjustedDayOfWeek; // Calculate the first day of the current week (Monday)
    const lastDayOfWeek = firstDayOfWeek + 6; // Calculate the last day of the current week (Sunday)

    const firstDateOfWeek = new Date(today);
    firstDateOfWeek.setDate(firstDayOfWeek);
    firstDateOfWeek.setHours(0, 0, 0, 0); // Set to start of the day

    const lastDateOfWeek = new Date(today);
    lastDateOfWeek.setDate(lastDayOfWeek);
    lastDateOfWeek.setHours(23, 59, 59, 999); // Set to end of the day

    return date >= firstDateOfWeek && date <= lastDateOfWeek; // Check if the given date falls within the current week
  };

  const isThisMonth = (date) => {
    const today = new Date();
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isThisYear = (date) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear();
  };

  const todaySales = calculateSales((t) => isToday(new Date(t.date)));
  const thisWeekSales = calculateSales((t) => isThisWeek(new Date(t.date)));
  const thisMonthSales = calculateSales((t) => isThisMonth(new Date(t.date)));
  const thisYearSales = calculateSales((t) => isThisYear(new Date(t.date)));

  const customerSpending = customers
    .map((customer) => {
      const totalSpending = transactions
        .filter((transaction) => transaction.customer === customer.name)
        .reduce((acc, transaction) => acc + transaction.grandTotal, 0);
      return { ...customer, totalSpending };
    })
    .sort((a, b) => b.totalSpending - a.totalSpending);

  return (
    <div className=" px-4 py-2 bg-[#191919]">
      <h1 className="text-2xl font-bold my-6 text-white">
        🍔 Chrome & Burger EPOS
      </h1>

      <ProductList products={products} addToCart={addToCart} />
      <div className="bg-[#242424] text-white p-4 rounded shadow my-4">
        <h2 className="text-xl font-bold mb-2">Select Customer</h2>
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(parseInt(e.target.value))}
          className="mb-4 p-2 border rounded bg-[#424242]"
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        <h2 className="text-xl font-bold my-4">Your Cart</h2>
        <Cart cartItems={cartItems} clearCart={clearCart} checkout={checkout} />
      </div>
      <div className="bg-[#242424] p-4 rounded my-4">
        <h2 className="text-xl text-white font-bold mb-2">Sales Summary</h2>
        <div className="bg-[#424242] text-white p-4 rounded shadow my-4">
          <p>Today&apos;s Total Sales: ${todaySales}</p>
          <p>This Week&apos;s Total Sales: ${thisWeekSales}</p>
          <p>This Month&apos;s Total Sales: ${thisMonthSales}</p>
          <p>This Year&apos;s Total Sales: ${thisYearSales}</p>
        </div>
      </div>
      <div className="bg-[#242424] p-4 my-4 rounded">
        <h2 className="text-xl text-white font-bold mb-2">
          Customer Rankings by Total Spending
        </h2>
        <div className="bg-[#424242] text-white p-4 rounded shadow my-4">
          <ul>
            {customerSpending.map((customer) => (
              <li key={customer.id}>
                {customer.name} - ${customer.totalSpending.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-[#242424] p-4 my-4 rounded">
        <h2 className="text-xl text-white font-bold mb-4">
          Transaction Details
        </h2>
        <TransactionList
          transactions={transactions}
          updateTransaction={updateTransaction}
          deleteTransaction={deleteTransaction}
          customers={customers}
        />
      </div>
    </div>
  );
}

export default App;
