import { useReducer } from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import "./style.css"

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OP: 'choose-op',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currOp: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currOp === "0") return state
      if (payload.digit === "." && (state.currOp.includes(".") || !state.currOp)) {
        return state
      }

      if (state.currOp === "0") {
        return {
          ...state,
          currOp: `${state.currOp || ""}${payload.digit}`
        }
      }

      return {
        ...state,
        currOp: `${state.currOp || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OP:
      if (state.currOp == null && state.prevOp == null){
        return state
      }

      if (state.currOp == null) {
        return {
          ...state,
          op: payload.operation
        }
      }

      if (state.prevOp == null){
        return {
          ...state,
          op: payload.operation,
          prevOp: state.currOp,
          currOp: null
        }
      }

        return {
          ...state,
          prevOp: evaluate(state),
          op: payload.operation,
          currOp: null
      }
    case ACTIONS.CLEAR:
      return {currOp: ""};
    case ACTIONS.EVALUATE:
      if (
          state.op == null ||
          state.currOp == null || 
          state.prevOp == null
      ) {
        return state
      }

        return {
          ...state,
          overwrite: true,
          prevOp: null,
          op: null,
          currOp: evaluate(state),
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currOp: null,
        }
      }
      if (state.currOp == null || state.currOp.length === 1) {
        return {
          ...state,
          currOp: "0",
        }
      } 

      return {
        ...state,
        currOp: state.currOp.slice(0, -1)
      }
    default:
      return state;
  }
}

function evaluate({ currOp, prevOp, op }) {
  const prev = parseFloat(prevOp)
  const curr = parseFloat(currOp)
  
  if (isNaN(prev) || isNaN(curr)) return ""
  
  let computation = ""
  switch (op) {
    case "+":
      computation = prev + curr
      break
    case "-":
      computation = prev - curr
      break
    case "*":
      computation = prev * curr
      break
    case "/":
      computation = prev / curr
      break
    default:
      return
  }

  return computation.toString()
}

const INTEGER_FORMATTER =  new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand){
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App(){
  const [{ currOp, prevOp, op }, dispatch] = useReducer(
    reducer,
    { currOp: ""}
  )

  return (
    <div class="calculator-grid" /*main calculator*/>
      <div class="output" /*output*/>
        <div class="prev-op" /*previous output*/>{formatOperand(prevOp)} {op}</div>
          <div class="curr-op" /*current output*/>{formatOperand(currOp)}</div>
      </div>
      <button 
        class="span-two word" 
        onClick={() => dispatch({ type: ACTIONS.CLEAR})}>
          AC
      </button>
      <button class="word"
        onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT})}>
          DEL
      </button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button 
        class="span-two" 
        onClick={() => dispatch({ type: ACTIONS.EVALUATE})}>
          =
      </button>
    </div>
  )
}

export default App