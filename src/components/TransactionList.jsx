import PropTypes from "prop-types";
import Transaction from "./Transaction";

const TransactionList = ({
  transactions, // transactions state value passed from App
  updateTransaction, // function passed from App
  deleteTransaction, // function passed from App
  customers,
}) => {
  return (
    <div> 
      {transactions.map((transaction) => (
        // list of Transaction components
        <Transaction
          key={transaction.transactionId}
          transaction={transaction}
          updateTransaction={updateTransaction}
          deleteTransaction={deleteTransaction}
          customers={customers}
        />
      ))}
    </div>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ).isRequired,
  updateTransaction: PropTypes.func.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TransactionList;
