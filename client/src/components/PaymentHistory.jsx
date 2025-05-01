import Menus from "@/ui/Menus"
import Table from "@/ui/Table"

export default function PaymentHistory() {
  return (
    <Table columns="1.2fr 1.2fr 1fr 0.7fr 1.2fr 0.7fr 1.1fr  0.5fr">
      <Table.Header>
        <div>Reference ID</div>
        <div>Taxpayer Name</div>
        <div>Tax Category</div>
        <div>Amount</div>
        <div>Payment Method</div>
        <div>Status</div>
        <div>Payment Date</div>
        <div>Actions</div>
      </Table.Header>

      <Table.Body
        data={[]}
        render={(data, dataIndex) => <UserRow rowData={data} key={dataIndex} />}
      />
    </Table>
  )
}
