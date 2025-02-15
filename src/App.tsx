import { useMachine } from '@xstate/react'
import './App.css'
import { ToggleEvent, toggleMachine } from './machines/toggle-machines'

function App() {
  const [state, send] = useMachine(toggleMachine)

  return (
    <>
      <div>{JSON.stringify(state.value)}</div>
      <div>count: {state.context.count}</div>
      <button
        onClick={() => send({ type: ToggleEvent.CLICK })}
        className="bg-blue-200 rounded-md py-1 px-3 text-state-800 text-base"
      >
        Toggle
      </button>
      <button
        onClick={() => send({ type: ToggleEvent.RESET })}
      >
        Reset
      </button>
    </>
  )
}

export default App
