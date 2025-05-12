import { createContext, useContext } from "react"
import styled from "styled-components"

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);

  font-size: 14px;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: x-auto;
`

const CommonRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  column-gap: 2rem;
  align-items: center;
  transition: none;
`

const StyledHeader = styled(CommonRow)`
  padding: 1rem 1.3rem;

  background-color: #f4f4f4;
  border-bottom: 1px solid #f9f9f9;
  letter-spacing: 0.4px;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  color: #777;
`

const StyledRow = styled(CommonRow)`
  padding: 1rem 2.4rem;
  position: relative;

  &:not(:last-child) {
    border-bottom: 1px solid #e3e6eb;
  }
`

const StyledBody = styled.section`
  margin: 0.4rem 0;
`

const Footer = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.2rem;

  /* This will hide the footer when it contains no child elements. Possible thanks to the parent selector :has 🎉 */
  &:not(:has(*)) {
    display: none;
  }
`

const Empty = styled.p`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
`

const TableContext = createContext()

function Table({ columns, children }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext.Provider>
  )
}

function Header({ children }) {
  const { columns } = useContext(TableContext)
  return (
    <StyledHeader role="row" columns={columns} as="header">
      {children}
    </StyledHeader>
  )
}
function Row({ children }) {
  const { columns } = useContext(TableContext)
  return (
    <StyledRow role="row" columns={columns}>
      {children}
    </StyledRow>
  )
}

function Body({ data, render }) {
  if (!data.length) return <Empty>No data to show at the moment</Empty>

  return <StyledBody>{data.map(render)}</StyledBody>
}

Table.Header = Header
Table.Body = Body
Table.Row = Row
Table.Footer = Footer

export default Table
