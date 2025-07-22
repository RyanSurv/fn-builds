import Keybinds from "@/components/Keybinds"
import Sequences from "@/components/Sequences"
import Play from "@/components/Play"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="m-4 space-y-4 container mx-auto flex-grow">
        <Keybinds />
        <div className="flex flex-wrap gap-4 items-start">
          <Sequences />
          <Play />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
