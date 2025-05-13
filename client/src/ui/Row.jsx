import Table from "@/ui/Table"

function Row({ rowData }) {
  return (
    <Table.Row>
      <p
        className={`${
          rowData.taxCategory === "personal"
            ? "text-green-600"
            : "text-blue-600"
        } text-[13px] uppercase font-semibold`}
      >
        {rowData.taxCategory}
      </p>
      <p className="text-[14px] text-center bg-amber-100 text-amber-700 w-fit px-2 rounded-2xl py-1">
        {rowData._id}
      </p>
      <p className="text-[14px]">{rowData.taxFiling.filingPeriod}</p>
      <p className="text-[14px]">
        {new Date(rowData.createdAt).toLocaleDateString()}
      </p>
      <p className="text-[14px]">{rowData.amount} birr</p>
      <p
        className={`${
          rowData.paymentType === "full"
            ? "text-green-700 bg-green-200"
            : "text-amber-700 bg-amber-200"
        } text-[14px] capitalize w-fit px-4 rounded-2xl py-1 text-center`}
      >
        {rowData.paymentType}
      </p>
    </Table.Row>
  )
}

export default Row
