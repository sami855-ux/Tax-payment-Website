import { useNavigate } from "react-router-dom"

import styles from "./ButtonTwo.module.css"

export default function ButtonTwo() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate("./login")
  }
  return (
    <button class={styles["animated-button"]} onClick={handleBack}>
      <span>Start Now</span>
      <span></span>
    </button>
  )
}
