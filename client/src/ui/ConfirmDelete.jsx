import styled from "styled-components"
import Button from "./Button"

const StyledConfirmDelete = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  background-color: white;
  padding: 1.5rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`

function ConfirmDelete({ resourceName, onConfirm, onCloseModal }) {
  return (
    <StyledConfirmDelete>
      <h3 className="py-2 font-semibold text-2xl">Delete {resourceName}</h3>
      <p>
        Are you sure you want to delete this {resourceName} permanently? This
        action cannot be undone.
      </p>

      <div>
        <button
          className="py-1 px-9 border border-gray-200 rounded-lg cursor-pointer bg-gray-300"
          onClick={onCloseModal}
        >
          Cancel
        </button>
        <button
          className="py-1 px-9 border border-gray-200 rounded-lg cursor-pointer bg-red-500 text-white"
          onClick={() => {
            onConfirm()
            onCloseModal()
          }}
        >
          Delete
        </button>
      </div>
    </StyledConfirmDelete>
  )
}

export default ConfirmDelete
