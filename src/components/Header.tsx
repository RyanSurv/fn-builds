import { Hammer } from "lucide-react"
import consts from "@/lib/consts";

function Header() {
    return (
        <header className="bg-primary">
            <div className="container mx-auto py-4">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <p className="text-xs font-bold text-muted-foreground">v{consts.version}</p>
                        <h1 className="text-2xl font-bold text-foreground">FN Build Repeater</h1>
                    </div>
                    <div className="flex items-center">
                        <Hammer className="h-8 w-8" />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
