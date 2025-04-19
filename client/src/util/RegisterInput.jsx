import { useReducer } from "react"
import { useNavigate } from "react-router-dom"
import {
  registerUser,
  validateEmail,
  validateEthiopianPhoneNumber,
} from "../helper/helper"

const initialState = {
  fullName: "",
  email: "",
  sex: "",
  mobilePhone: "",
  place: "",
  woreda: "",
  kebele: "",
  taxId: "",
  password: "",
  confirmPassword: "",
  error: "",
}

const reducer = (state, action) => {
  switch (action.type) {
    case "fullName_save": {
      // let fullName = action.payload
      // let name = fullName?.split(" ")

      // if (name?.length !== 3) {
      //   state.error = "Full Name is incomplete"
      //   return state
      // }

      return {
        ...state,
        fullName: action.payload,
      }
    }
    case "email_save":
      return {
        ...state,
        email: action.payload,
      }
    case "sex_save":
      return {
        ...state,
        sex: action.payload,
      }
    case "tel_save":
      return {
        ...state,
        mobilePhone: action.payload,
      }
    case "place_save":
      return {
        ...state,
        place: action.payload,
      }
    case "woreda_save":
      return {
        ...state,
        woreda: action.payload,
      }
    case "kebele_save":
      return {
        ...state,
        kebele: action.payload,
      }
    case "tax_save":
      return {
        ...state,
        taxId: action.payload,
      }
    case "password_save":
      return {
        ...state,
        password: action.payload,
      }
    case "confirm_save":
      return {
        ...state,
        confirmPassword: action.payload,
      }
    case "submit_form":
      {
        if (
          !state.fullName ||
          !state.email ||
          !state.mobilePhone ||
          !state.password ||
          !state.confirmPassword ||
          !state.taxId ||
          !state.kebele ||
          !state.woreda ||
          !state.sex ||
          !state.place
        ) {
          return {
            ...state,
            error: "Field are Empty",
          }
        } else if (state.password !== state.confirmPassword) {
          return {
            ...state,
            error: "Password is not the same",
          }
        } else if (!validateEthiopianPhoneNumber(state.mobilePhone)) {
          return {
            ...state,
            error: "Mobile Phone is not the valid",
          }
        } else if (!validateEmail(state.email)) {
          return {
            ...state,
            error: "Invalid Email",
          }
        }

        const userData = {
          fullName: state.fullName,
          gender: state.sex,
          phoneNumber: state.mobilePhone,
          taxId: state.taxId,
          emailAddress: state.email,
          residentialAddress: state.place,
          kebele: state.kebele,
          woreda: state.woreda,
          password: state.password,
        }
        console.log(userData)
        registerUser(userData)
          .then(() => {
            return {
              ...state,
              error: "Registration successful",
            }
          })
          .catch(() => {
            return {
              ...state,
              error: "Registration failed",
            }
          })
      }
      break
    default:
      throw new Error("Invalid action!!")
  }
}

export default function RegisterInput() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const navigate = useNavigate()
  const {
    fullName,
    email,
    sex,
    mobilePhone,
    place,
    woreda,
    kebele,
    taxId,
    password,
    confirmPassword,
    error,
  } = state

  const handleBack = () => {
    navigate(-1)
  }
  return (
    <div className="w-[95%] h-fit flex flex-col pt-5 pr-14">
      {error && (
        <p className="w-full py-2 text-[15px] px-4 rounded-md my-1 bg-[#e86363]/50 text-white">
          {error}
        </p>
      )}

      <form className="w-full h-14 flex gap-4 items-center  my-4">
        <FormCell
          placeholder="Enter your full name"
          name="Full Name"
          type="text"
          width="1/2"
          value={fullName}
          method_red={(e) => {
            dispatch({
              type: "fullName_save",
              payload: e.target.value,
            })
          }}
        />
        <FormCell
          placeholder="Enter your email"
          name="Email"
          type="email"
          width="1/2"
          value={email}
          method_red={(e) => {
            dispatch({
              type: "email_save",
              payload: e.target.value,
            })
          }}
        />
      </form>
      <div className="w-full h-14 flex flex-col my-">
        <label htmlFor="sex" className="text-[15px]">
          Sex
        </label>
        <select
          id="sex"
          name="sex"
          value={sex}
          onChange={(e) => {
            dispatch({
              type: "sex_save",
              payload: e.target.value,
            })
          }}
          className="border border-gray-300 py-2 px-3 rounded-md outline-none focus:border-blue-500 text-[15px]"
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="w-full h-14 flex gap-4 items-center   my-4">
        <FormCell
          placeholder="Enter mobile phone"
          name="Mobile Phone"
          type="tel"
          width="1/2"
          value={mobilePhone}
          method_red={(e) => {
            dispatch({
              type: "tel_save",
              payload: e.target.value,
            })
          }}
        />
        <FormCell
          placeholder="Enter your residency"
          name="Residency Place"
          type="text"
          width="1/2"
          value={place}
          method_red={(e) => {
            dispatch({
              type: "place_save",
              payload: e.target.value,
            })
          }}
        />
      </div>
      <div className="w-full h-14 flex gap-4 items-center   my-4">
        <FormCell
          placeholder="Enter your woreda"
          name="Woreda"
          type="tel"
          width="1/2"
          value={woreda}
          method_red={(e) => {
            dispatch({
              type: "woreda_save",
              payload: e.target.value,
            })
          }}
        />
        <FormCell
          placeholder="Enter your kebele"
          name="Kebele"
          type="text"
          width="1/2"
          value={kebele}
          method_red={(e) => {
            dispatch({
              type: "kebele_save",
              payload: e.target.value,
            })
          }}
        />
      </div>
      <FormCell
        placeholder="Enter your tax id"
        name="Tax ID"
        type="text"
        width="full"
        value={taxId}
        method_red={(e) => {
          dispatch({
            type: "tax_save",
            payload: e.target.value,
          })
        }}
      />
      <div className="w-full h-14 flex gap-4 items-center   my-4">
        <FormCell
          placeholder="Enter your password"
          name="Password"
          type="password"
          width="1/2"
          value={password}
          method_red={(e) => {
            dispatch({
              type: "password_save",
              payload: e.target.value,
            })
          }}
        />
        <FormCell
          placeholder="Confirm your password"
          name="Confirm password"
          type="password"
          width="1/2"
          value={confirmPassword}
          method_red={(e) => {
            dispatch({
              type: "confirm_save",
              payload: e.target.value,
            })
          }}
        />
      </div>
      <div className="w-full h-14 flex gap-4 items-center justify-between my-2">
        <button
          className="border border-gray-300 py-1 px-14 rounded-md cursor-pointer"
          onClick={handleBack}
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={() => {
            console.log("hi")
            dispatch({
              type: "submit_form",
            })
          }}
          className="border border-gray-300 py-1 hover:bg-blue-800 px-14 rounded-md cursor-pointer bg-blue-900 text-white"
        >
          Submit
        </button>
      </div>
    </div>
  )
}

const FormCell = ({ name, type, width, placeholder, value, method_red }) => {
  return (
    <div className={`w-${width} h-14 flex flex-col`}>
      <label htmlFor={name} className="pb-1 text-gray-800 text-[15px]">
        {name}
      </label>
      <input
        value={value}
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={method_red}
        className="border text-[15px] border-gray-300 py-1 px-3 rounded-md outline-none focus:border-blue-500"
      />
    </div>
  )
}
