import { useState, useRef, useEffect } from "react"
import { Pencil, Info, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"

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
    const reset = useRef<HTMLInputElement>(null);
    const play = useRef<HTMLInputElement>(null);
    const stop = useRef<HTMLInputElement>(null);
    const playLoop = useRef<HTMLInputElement>(null);

    const [wallBind, setWallBind] = useState("");
    const [floorBind, setFloorBind] = useState("");
    const [rampBind, setRampBind] = useState("");
    const [coneBind, setConeBind] = useState("");
    const [editBind, setEditBind] = useState("");
    const [resetBind, setResetBind] = useState("");
    const [playBind, setPlayBind] = useState("");
    const [stopBind, setStopBind] = useState("");
    const [playLoopBind, setPlayLoopBind] = useState("");
    const [ignoredKeys, setIgnoredKeys] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(false);

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
                setResetBind(keybinds.reset || "");
                setPlayBind(keybinds.play || "");
                setStopBind(keybinds.stop || "");
                setPlayLoopBind(keybinds.playLoop || "");
                setIgnoredKeys(keybinds.ignoredKeys || "");

                // Update input values with a slight delay to ensure DOM is ready
                setTimeout(() => {
                    if (wall.current) wall.current.value = keybinds.wall || "";
                    if (floor.current) floor.current.value = keybinds.floor || "";
                    if (ramp.current) ramp.current.value = keybinds.ramp || "";
                    if (cone.current) cone.current.value = keybinds.cone || "";
                    if (edit.current) edit.current.value = keybinds.edit || "";
                    if (reset.current) reset.current.value = keybinds.reset || "";
                    if (play.current) play.current.value = keybinds.play || "";
                    if (stop.current) stop.current.value = keybinds.stop || "";
                    if (playLoop.current) playLoop.current.value = keybinds.playLoop || "";
                }, 0);
            } catch (error) {
                console.error('Failed to load keybinds from localStorage:', error);
            }
        }
    }, []);

    // Load values for collapsible section when it becomes visible
    useEffect(() => {
        if (showMoreOptions) {
            const savedKeybinds = localStorage.getItem('keybinds');
            if (savedKeybinds) {
                try {
                    const keybinds = JSON.parse(savedKeybinds);
                    // Ensure the values are set when the section becomes visible
                    setTimeout(() => {
                        if (reset.current) reset.current.value = keybinds.reset || "";
                        if (play.current) play.current.value = keybinds.play || "";
                        if (stop.current) stop.current.value = keybinds.stop || "";
                        if (playLoop.current) playLoop.current.value = keybinds.playLoop || "";
                    }, 0);
                } catch (error) {
                    console.error('Failed to load keybinds from localStorage:', error);
                }
            }
        }
    }, [showMoreOptions]);

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
        if (reset.current) {
            reset.current.value = "";
            setResetBind("");
        }
        if (play.current) {
            play.current.value = "";
            setPlayBind("");
        }
        if (stop.current) {
            stop.current.value = "";
            setStopBind("");
        }
        if (playLoop.current) {
            playLoop.current.value = "";
            setPlayLoopBind("");
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
            reset: resetBind,
            play: playBind,
            stop: stopBind,
            playLoop: playLoopBind,
            ignoredKeys: ignoredKeys
        };
        localStorage.setItem('keybinds', JSON.stringify(keybinds));

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('keybindsUpdated'));

        // Show success alert
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 5000);
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

            {showSuccessAlert &&
                <Alert className="mb-4 border-green-200 bg-green-200">
                    <CheckCircle />
                    <AlertTitle className="text-green-800">Success!</AlertTitle>
                    <AlertDescription className="text-green-700">
                        Keybinds have been saved successfully.
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
            </div>

            {showMoreOptions && (
                <div className="mt-4 space-y-4 border-t pt-4">
                    <div className="flex flex-wrap justify-center items-end space-x-4">
                        <div className="space-y-2">
                            <Label>Play</Label>
                            <div className="flex space-x-2">
                                <Input disabled maxLength={1} className="w-[100px]" ref={play} />
                                <Button onClick={() => editKeybind(play, setPlayBind)} variant={"ghost"}><Pencil /></Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Stop</Label>
                            <div className="flex space-x-2">
                                <Input disabled maxLength={1} className="w-[100px]" ref={stop} />
                                <Button onClick={() => editKeybind(stop, setStopBind)} variant={"ghost"}><Pencil /></Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Play Loop</Label>
                            <div className="flex space-x-2">
                                <Input disabled maxLength={1} className="w-[100px]" ref={playLoop} />
                                <Button onClick={() => editKeybind(playLoop, setPlayLoopBind)} variant={"ghost"}><Pencil /></Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Reset Game</Label>
                            <div className="flex space-x-2">
                                <Input disabled maxLength={1} className="w-[100px]" ref={reset} />
                                <Button onClick={() => editKeybind(reset, setResetBind)} variant={"ghost"}><Pencil /></Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ignored-keys">Ignored Keys</Label>
                            <Input
                                id="ignored-keys"
                                className="w-[200px]"
                                placeholder="e.g., W,A,Escape,Tab.."
                                value={ignoredKeys}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIgnoredKeys(e.target.value)}
                            />
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground text-center">
                        Ignored keys will be ignored when playing sequences. Separate values with commas. "Reset Game" resets the inputs for the sequence, this is not your FN "Reset" bind.
                    </p>
                </div>
            )}

            <div className="flex justify-center space-x-2 mt-6">
                <Button
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    variant="outline"
                    className="flex items-center space-x-2"
                >
                    <span>Show {showMoreOptions ? "Less" : "More"} Options</span>
                    {showMoreOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
                <Button variant={"destructive"} onClick={() => clearKeybinds()}>Clear</Button>
                <Button onClick={() => saveKeybinds()}>Save</Button>
            </div>
        </div>
    )
}

export default Keybinds
