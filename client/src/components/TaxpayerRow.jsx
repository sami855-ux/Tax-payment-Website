import { BadgeCheck, Bell, Eye, Trash2 } from "lucide-react"
import { HiPencil } from "react-icons/hi"

import ConfirmDelete from "@/ui/ConfirmDelete"
import ModalMenu from "@/ui/ModalMenu"
import Table from "@/ui/Table"
import Menus from "@/ui/Menus"

function TaxpayerRow({ rowData }) {
  const {
    name,
    tin,
    kebele,
    phone,
    filingStatus,
    outstandingPayments,
    lastFilingDate,
    noticesSent,
  } = rowData

  return (
    <>
      <Table.Row>
        <p className="text-[14px]">{name}</p>
        <p className="text-[14px] font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
          {tin}
        </p>
        <p className="text-[14px]">{kebele}</p>
        <p className="text-[14px]">{phone}</p>
        <p
          className={`text-[13px] ml-2 text-center py-1 w-20  rounded-2xl font-medium ${
            filingStatus === "Compliant"
              ? "text-green-600 bg-green-100"
              : filingStatus === "Pending"
              ? "text-yellow-600 bg-yellow-100"
              : "text-red-600 bg-red-100"
          }`}
        >
          {filingStatus}
        </p>
        <p
          className={`text-[14px] font-semibold ${
            outstandingPayments === 0
              ? "text-green-600"
              : outstandingPayments < 300000
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          ETB {outstandingPayments.toLocaleString()}
        </p>
        <p className="text-[14px]">{new Date(lastFilingDate).toDateString()}</p>
        <p className="text-[14px]">{noticesSent}</p>
        <div>
          <ModalMenu>
            <Menus.Menu>
              <Menus.Toggle id={tin} />

              <Menus.List id={tin}>
                <ModalMenu.Open opens={"edit"}>
                  <Menus.Button
                    icon={<Bell className="text-green-700" size={20} />}
                  >
                    Sent Reminder
                  </Menus.Button>
                </ModalMenu.Open>

                <Menus.Button
                  icon={<Eye className="text-amber-700" size={20} />}
                >
                  View Details
                </Menus.Button>
              </Menus.List>
            </Menus.Menu>
          </ModalMenu>
        </div>
      </Table.Row>
    </>
  )
}

export default TaxpayerRow
