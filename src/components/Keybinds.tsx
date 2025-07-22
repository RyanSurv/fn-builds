import { useState, useRef, useEffect } from "react"
import { Pencil, Info } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function Keybinds() {
    const wall = useRef<HTMLInputElement>(null);
    const floor = useRef<HTMLInputElement>(null);
    const ramp = useRef<HTMLInputElement>(null);
    const cone = useRef<HTMLInputElement>(null);
    const edit = useRef<HTMLInputElement>(null);

    const [wallBind, setWallBind] = useState("");
    const [floorBind, setFloorBind] = useState("");
    const [rampBind, setRampBind] = useState("");
    const [coneBind, setConeBind] = useState("");
    const [editBind, setEditBind] = useState("");
    const [ignoredKeys, setIgnoredKeys] = useState("");

    const [isEditing, setIsEditing] = useState(false);

    // Load keybinds from localStorage on component mount
    useEffect(() => {
        const savedKeybinds = localStorage.getItem('keybinds');
        if (savedKeybinds) {
            try {
                const keybinds = JSON.parse(savedKeybinds);

                // Update state
                setWallBind(keybinds.wall || "");
                setFloorBind(keybinds.floor || "");
                setRampBind(keybinds.ramp || "");
                setConeBind(keybinds.cone || "");
                setEditBind(keybinds.edit || "");
                setIgnoredKeys(keybinds.ignoredKeys || "");

                // Update input values
                if (wall.current) wall.current.value = keybinds.wall || "";
                if (floor.current) floor.current.value = keybinds.floor || "";
                if (ramp.current) ramp.current.value = keybinds.ramp || "";
                if (cone.current) cone.current.value = keybinds.cone || "";
                if (edit.current) edit.current.value = keybinds.edit || "";
            } catch (error) {
                console.error('Failed to load keybinds from localStorage:', error);
            }
        }
    }, []);

    function clearKeybinds() {
        if (wall.current) {
            wall.current.value = "";
            setWallBind("");
        }
        if (floor.current) {
            floor.current.value = "";
            setFloorBind("");
        }
        if (ramp.current) {
            ramp.current.value = "";
            setRampBind("");
        }
        if (cone.current) {
            cone.current.value = "";
            setConeBind("");
        }
        if (edit.current) {
            edit.current.value = "";
            setEditBind("");
        }
        setIgnoredKeys("");
    }

    function saveKeybinds() {
        const keybinds = {
            wall: wallBind,
            floor: floorBind,
            ramp: rampBind,
            cone: coneBind,
            edit: editBind,
            ignoredKeys: ignoredKeys
        };
        localStorage.setItem('keybinds', JSON.stringify(keybinds));

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('keybindsUpdated'));

        toast("Keybinds have been saved.")
    }

    function editKeybind(inputRef: React.RefObject<HTMLInputElement | null>, setSetter: (value: string) => void) {
        if (!inputRef.current) return;

        setIsEditing(true);
        inputRef.current.focus();

        // Add listeners for next key press or mouse button press
        const handleKeyPress = (event: KeyboardEvent) => {
            event.preventDefault();
            const key = event.key.length === 1 ? event.key.toUpperCase() : event.code;
            if (inputRef.current) {
                inputRef.current.value = key;
                setSetter(key);
            }
            // Remove listeners after capturing input
            document.removeEventListener('keydown', handleKeyPress);
            document.removeEventListener('mousedown', handleMousePress);
            inputRef.current?.blur();
            setIsEditing(false);
        };

        const handleMousePress = (event: MouseEvent) => {
            event.preventDefault();
            const mouseButton = `Mouse${event.button}`;
            if (inputRef.current) {
                inputRef.current.value = mouseButton;
                setSetter(mouseButton);
            }
            // Remove listeners after capturing input
            document.removeEventListener('keydown', handleKeyPress);
            document.removeEventListener('mousedown', handleMousePress);
            inputRef.current?.blur();
            setIsEditing(false);
        };

        // Add event listeners
        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('mousedown', handleMousePress);
    }

    return (
        <div className="p-4 border border-light rounded-sm">
            {isEditing &&
                <Alert className="mb-4">
                    <Info />
                    <AlertTitle>Press your bind button</AlertTitle>
                    <AlertDescription>
                        Press your bind button on your mouse or keyboard to set this keybind
                    </AlertDescription>
                </Alert>
            }

            <div className="flex flex-wrap justify-center items-end space-x-4">
                <div className="space-y-2">
                    <Label>Wall</Label>
                    <div className="flex space-x-2">
                        <Input disabled maxLength={1} className="w-[100px]" ref={wall} />
                        <Button onClick={() => editKeybind(wall, setWallBind)} variant={"ghost"}><Pencil /></Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Floor</Label>
                    <div className="flex space-x-2">
                        <Input disabled maxLength={1} className="w-[100px]" ref={floor} />
                        <Button onClick={() => editKeybind(floor, setFloorBind)} variant={"ghost"}><Pencil /></Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Ramp</Label>
                    <div className="flex space-x-2">
                        <Input disabled maxLength={1} className="w-[100px]" ref={ramp} />
                        <Button onClick={() => editKeybind(ramp, setRampBind)} variant={"ghost"}><Pencil /></Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Cone</Label>
                    <div className="flex space-x-2">
                        <Input disabled maxLength={1} className="w-[100px]" ref={cone} />
                        <Button onClick={() => editKeybind(cone, setConeBind)} variant={"ghost"}><Pencil /></Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Edit</Label>
                    <div className="flex space-x-2">
                        <Input disabled maxLength={1} className="w-[100px]" ref={edit} />
                        <Button onClick={() => editKeybind(edit, setEditBind)} variant={"ghost"}><Pencil /></Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ignored-keys">Ignored Keys</Label>
                    <Input
                        id="ignored-keys"
                        className="w-[200px]"
                        placeholder="e.g., Escape, Tab, F1"
                        value={ignoredKeys}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIgnoredKeys(e.target.value)}
                    />
                </div>
            </div>

            <p className="text-sm text-muted-foreground mt-2 text-center">
                Ignored keys will be ignored when playing sequences. Separate values with commas.
            </p>

            <div className="flex justify-center space-x-2 mt-6">
                <Button variant={"destructive"} onClick={() => clearKeybinds()}>Clear</Button>
                <Button onClick={() => saveKeybinds()}>Save</Button>
            </div>
        </div>
    )
}

export default Keybinds
