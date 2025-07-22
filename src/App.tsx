import Keybinds from "@/components/Keybinds"
import Sequences from "@/components/Sequences"
import Play from "@/components/Play"

function App() {
  return (
    <div className="m-4 space-y-4">
      <Keybinds />
      <div className="flex flex-wrap gap-4 items-start">
        <Sequences />
        <Play />
      </div>
    </div>
  )
}

export default App
