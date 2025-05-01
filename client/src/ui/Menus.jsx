import { createContext, useContext, useState } from "react"
import { createPortal } from "react-dom"
import { HiEllipsisVertical } from "react-icons/hi2"
import styled from "styled-components"
import { useOutsideClick } from "../hooks/useOutsideClick"

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: 4px;
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: #e3e6eb;
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`

const StyledList = styled.ul`
  position: fixed;

  background-color: white;
  padding: 0.4rem 0.8rem;
  box-shadow: gray);
  border: 1px solid #e3e6eb;
  border-radius: 7px;

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1rem 2.4rem;
  font-size: 0.9rem;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1.2rem;

  &:hover {
    background-color: #f4f4f4;
  }
`

const MenusContext = createContext()

function Menus({ children }) {
  const [openId, setOpenId] = useState("")
  const [position, setPosition] = useState(null)

  const close = () => setOpenId("")
  const open = setOpenId

  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  )
}

function Toggle({ id }) {
  const { openId, close, open, setPosition } = useContext(MenusContext)

  function handleClick(e) {
    e.stopPropagation()

    const rect = e.target.closest("button").getBoundingClientRect()
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    })

    openId === "" || openId !== id ? open(id) : close()
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical className="text-gray-700 cursor-pointer" />
    </StyledToggle>
  )
}

function List({ id, children }) {
  const { openId, position, close } = useContext(MenusContext)
  const ref = useOutsideClick(close, false)

  if (openId !== id) return null

  return createPortal(
    <StyledList position={position} ref={ref}>
      {children}
    </StyledList>,
    document.body
  )
}

function Button({ children, icon, onClick }) {
  const { close } = useContext(MenusContext)

  function handleClick() {
    onClick?.()
    close()
  }

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  )
}

Menus.Menu = Menu
Menus.Toggle = Toggle
Menus.List = List
Menus.Button = Button

export default Menus
