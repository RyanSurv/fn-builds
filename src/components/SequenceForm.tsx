import { useState, useRef, useEffect } from "react"
import { Trash, GripVertical } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
    createSequence: (sequence: Sequence) => void,
    editingSequence?: Sequence | null,
    isEditing?: boolean,
    existingSequences: Sequence[]
}

type Sequence = {
    name: string,
    steps: string[]
}

function SequenceForm(props: Props) {
    const nameRef = useRef<HTMLInputElement>(null);
    const [sequence, setSequence] = useState<string[]>([]);
    const [nameError, setNameError] = useState<string>("");

    // Validate sequence name
    function validateSequenceName(name: string): boolean {
        if (!name || name.trim() === "") {
            setNameError("Sequence name cannot be empty");
            return false;
        }

        // Check for duplicate names (case-insensitive)
        const duplicateExists = props.existingSequences.some(existingSeq => {
            // When editing, allow the same name if it's the current sequence being edited
            if (props.isEditing && props.editingSequence && existingSeq.name === props.editingSequence.name) {
                return false;
            }
            return existingSeq.name.toLowerCase() === name.toLowerCase();
        });

        if (duplicateExists) {
            setNameError(`A sequence with the name "${name}" already exists`);
            return false;
        }

        setNameError("");
        return true;
    }

    function handleCreateSequence() {
        const name = nameRef.current?.value?.trim() || "Unnamed";
        
        if (validateSequenceName(name)) {
            props.createSequence({ name, steps: sequence });
        }
    }

    function exportSequence() {
        if (!props.editingSequence) return;
        
        const sequenceData = {
            name: props.editingSequence.name,
            steps: props.editingSequence.steps
        };
        
        const jsonString = JSON.stringify(sequenceData, null, 2);
        
        // Copy to clipboard
        navigator.clipboard.writeText(jsonString).then(() => {
            alert(`Sequence "${props.editingSequence!.name}" copied to clipboard!`);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = jsonString;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert(`Sequence "${props.editingSequence!.name}" copied to clipboard!`);
        });
    }

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

            {sequence.length > 1 && <div className="mt-8 space-y-2">
                <div className="flex space-x-2">
                    <Input
                        placeholder="Sequence name.."
                        ref={nameRef}
                        key={props.isEditing ? 'editing' : 'creating'}
                        defaultValue={props.isEditing && props.editingSequence ? props.editingSequence.name : ""}
                        onChange={() => {
                            // Clear error when user starts typing
                            if (nameError) {
                                setNameError("");
                            }
                        }}
                        className={nameError ? "border-red-500" : ""}
                    />
                    <Button onClick={handleCreateSequence}>
                        {props.isEditing ? "Update" : "Create"}
                    </Button>
                    {props.isEditing && (
                        <Button onClick={exportSequence} variant="outline">
                            Export
                        </Button>
                    )}
                </div>
                {nameError && (
                    <p className="text-red-500 text-sm">{nameError}</p>
                )}
            </div>}
        </div>
    )
}

export default SequenceForm
