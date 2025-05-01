import { cn } from "@/helpers/util"
import * as Dialog from "@radix-ui/react-dialog"
import { FaTimes } from "react-icons/fa"

export default function Modal({
  isOpen,
  setIsOpen,
  title,
  description,
  children,
  modalClassName = "",
}) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 backdrop-blur-[4px] fixed inset-0 z-40" />

        <Dialog.Content
          className={cn(
            "bg-white rounded-xl shadow-xl p-6 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100",
            modalClassName
          )}
        >
          <Dialog.Title className="text-xl font-semibold">{title}</Dialog.Title>
          <Dialog.Description className="text-gray-500 mt-2 text-[15px] mb-4">
            {description}
          </Dialog.Description>

          <div className="mt-4">
            {/* Add your form or content here */}
            {children}
          </div>

          <Dialog.Close asChild>
            <button className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer">
              <FaTimes size={20} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
