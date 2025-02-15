import { useMachine } from '@xstate/react'
import './App.css'
import { toggleMachine } from './machines/toggle-machines'

function App() {
  const [state, send] = useMachine(toggleMachine)

  return (
    <>
      <div>{JSON.stringify(state.value)}</div>
      <div>count: {state.context.count}</div>
      <button
        onClick={() => send({ type: "click" })}
        className="bg-blue-200 rounded-md py-1 px-3 text-state-800 text-base"
      >
        Toggle
      </button>
    </>
  )
}

export default App
