import Keybinds from "@/components/Keybinds"
import Sequences from "@/components/Sequences"
import Play from "@/components/Play"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FAQ from "@/components/FAQ"

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="m-4 space-y-4 container mx-auto flex-grow">
        <Keybinds />
        <div className="flex flex-wrap gap-4 items-start">
          <Sequences />
          <div className="space-y-2 flex-grow">
            <Play />
            <FAQ />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
