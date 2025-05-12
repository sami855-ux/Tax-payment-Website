import Table from "@/ui/Table"
import Row from "@/ui/Row"
import payment from "@/data/payment.json"

function HistoryTable() {
  return (
    <Table columns="1fr 1.5fr 1.5fr 1fr 1fr 0.5fr">
      <Table.Header>
        <div>Tax Category</div>
        <div>Transaction ID</div>
        <div>Tax period</div>
        <div>Date</div>
        <div>Amount paid</div>
        <div>Action</div>
      </Table.Header>

      <Table.Body
        // data={cabins}
        // data={filteredCabins}
        data={payment}
        render={(data, dataIndex) => <Row rowData={data} key={dataIndex} />}
      />
    </Table>
  )
}

export default HistoryTable
