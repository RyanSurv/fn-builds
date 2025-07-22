import { useState, useRef, useEffect } from "react"
import { Trash, GripVertical } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
    createSequence: (sequence: Sequence) => void,
    editingSequence?: Sequence | null,
    isEditing?: boolean
}

type Sequence = {
    name: string,
    steps: string[]
}

function SequenceForm(props: Props) {
    const nameRef = useRef<HTMLInputElement>(null);
    const [sequence, setSequence] = useState<string[]>([]);

    // Load editing sequence data when editing
    useEffect(() => {
        if (props.isEditing && props.editingSequence) {
            setSequence(props.editingSequence.steps);
            // Use setTimeout to ensure the input is rendered before setting value
            setTimeout(() => {
                if (nameRef.current) {
                    nameRef.current.value = props.editingSequence!.name;
                }
            }, 0);
        } else {
            setSequence([]);
            // Clear the input when not editing
            setTimeout(() => {
                if (nameRef.current) {
                    nameRef.current.value = "";
                }
            }, 0);
        }
    }, [props.isEditing, props.editingSequence]);

    function addStep(step: string) {
        setSequence([...sequence, step]);
    }

    function removeStep(index: number) {
        setSequence(sequence.filter((_, idx) => idx !== index));
    }

    function moveStep(fromIndex: number, toIndex: number) {
        const newSequence = [...sequence];
        const [movedStep] = newSequence.splice(fromIndex, 1);
        newSequence.splice(toIndex, 0, movedStep);
        setSequence(newSequence);
    }

    function handleDragStart(e: React.DragEvent, index: number) {
        e.dataTransfer.setData('text/plain', index.toString());
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(e: React.DragEvent, dropIndex: number) {
        e.preventDefault();
        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
        if (dragIndex !== dropIndex) {
            moveStep(dragIndex, dropIndex);
        }
    }

    return (
        <div>
            <div className="flex flex-wrap space-x-2">
                <Button onClick={() => addStep("wall")}>Wall</Button>
                <Button onClick={() => addStep("floor")}>Floor</Button>
                <Button onClick={() => addStep("ramp")}>Ramp</Button>
                <Button onClick={() => addStep("cone")}>Cone</Button>
                <Button onClick={() => addStep("edit")}>Edit</Button>
                <Button onClick={() => addStep("lmb")}>LMB</Button>
            </div>

            <div className="mt-8">
                <p className="font-bold">Sequence:</p>
                <ol className="mt-4 space-y-2">
                    {sequence.map((step, idx) => {
                        return (
                            <li 
                                key={idx}
                                className="flex justify-between items-center space-x-2 p-2 border border-border rounded-sm bg-background hover:bg-muted cursor-move"
                                draggable
                                onDragStart={(e) => handleDragStart(e, idx)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, idx)}
                            >
                                <div className="flex items-center space-x-2">
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    <p>{idx + 1}. {step}</p>
                                </div>
                                <Button variant={"destructive"} size="sm" onClick={() => removeStep(idx)}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </li>
                        )
                    })}
                </ol>
            </div>

            {sequence.length > 1 && <div className="mt-8 flex space-x-2">
                <Input
                    placeholder="Sequence name.."
                    ref={nameRef}
                    key={props.isEditing ? 'editing' : 'creating'}
                    defaultValue={props.isEditing && props.editingSequence ? props.editingSequence.name : ""}
                />
                <Button onClick={() => props.createSequence({ name: nameRef.current?.value || "Unnamed", steps: sequence })}>
                    {props.isEditing ? "Update" : "Create"}
                </Button>
            </div>}
        </div>
    )
}

export default SequenceForm
