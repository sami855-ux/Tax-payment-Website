import styled from "styled-components"

import Table from "@/ui/Table"

// const TableRow = styled.div`
//   display: grid;
//   grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
//   column-gap: 2.4rem;
//   align-items: center;
//   padding: 1.4rem 2.4rem;

//   &:not(:last-child) {
//     border-bottom: 1px solid var(--color-grey-100);
//   }
// `;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`

const Price = styled.div`
  font-weight: 600;
`

const Discount = styled.div`
  font-weight: 500;
  color: var(--color-green-700);
`

function CabinRow({ rowData }) {
  return (
    <Table.Row>
      <p className=""></p>
      <p className="text-[15px]">{rowData.taxCategory}</p>
      <p className="text-[15px]">{rowData.transactionId}</p>
      <p className="text-[15px]">{rowData.taxPeriod}</p>
      <p className="text-[15px]">{new Date(rowData.date).toDateString()}</p>
      <p className="text-[15px]">{rowData.amountPaid}</p>
    </Table.Row>
  )
}

export default CabinRow
