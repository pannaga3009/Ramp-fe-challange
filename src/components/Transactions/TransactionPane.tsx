// TransactionPane.js

import { useState, useEffect } from "react";
import { InputCheckbox } from "../InputCheckbox";
import { TransactionPaneComponent } from "./types";
import {useCustomFetch} from "../../hooks/useCustomFetch";

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
}) => {
  const [approved, setApproved] = useState(transaction.approved);
  const { clearCache } = useCustomFetch();

 const handleApprovalChange = async (newValue: boolean) => {
    // Call the setTransactionApproval function
    await consumerSetTransactionApproval({
      transactionId: transaction.id,
      newValue,
    });

    // Update the state with the new approval value
    await clearCache();
    setApproved(newValue);
  };


  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        onChange={handleApprovalChange}
        
      />
    </div>
  );
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
