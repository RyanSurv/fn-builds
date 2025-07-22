import { useState, useEffect } from "react"
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import SequenceForm from "@/components/SequenceForm"

function App() {
    const [sequences, setSequences] = useState<{ name: string, steps: string[] }[]>([]);
    const [editingSequence, setEditingSequence] = useState<{ name: string, steps: string[] } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [importJson, setImportJson] = useState("");
    const [importError, setImportError] = useState("");

    // Load sequences from localStorage on component mount
    useEffect(() => {
        const savedSequences = localStorage.getItem('sequences');
        if (savedSequences) {
            try {
                const parsedSequences = JSON.parse(savedSequences);
                setSequences(parsedSequences);
            } catch (error) {
                console.error('Failed to load sequences from localStorage:', error);
            }
        }
    }, []);

    function createSequence(sequence: { name: string, steps: string[] }) {
        // Check for duplicate names (case-insensitive)
        const duplicateExists = sequences.some(existingSeq => {
            // When editing, allow the same name if it's the current sequence being edited
            if (isEditing && editingSequence && existingSeq.name === editingSequence.name) {
                return false;
            }
            return existingSeq.name.toLowerCase() === sequence.name.toLowerCase();
        });

        if (duplicateExists) {
            alert(`A sequence with the name "${sequence.name}" already exists. Please choose a different name.`);
            return;
        }

        if (isEditing && editingSequence) {
            // Update existing sequence
            const updatedSequences = sequences.map(seq =>
                seq.name === editingSequence.name ? sequence : seq
            );
            setSequences(updatedSequences);
            localStorage.setItem('sequences', JSON.stringify(updatedSequences));
            setIsEditing(false);
            setEditingSequence(null);
        } else {
            // Create new sequence
            const updatedSequences = [...sequences, sequence];
            setSequences(updatedSequences);
            localStorage.setItem('sequences', JSON.stringify(updatedSequences));
        }

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('sequencesUpdated'));
        setIsDialogOpen(false);
    }

    function editSequence(sequence: { name: string, steps: string[] }) {
        setEditingSequence(sequence);
        setIsEditing(true);
        setIsDialogOpen(true);
    }

    function startNewSequence() {
        setEditingSequence(null);
        setIsEditing(false);
        setIsDialogOpen(true);
    }

    function importSequence() {
        try {
            const parsedSequence = JSON.parse(importJson);
            
            // Validate the parsed data
            if (!parsedSequence.name || !parsedSequence.steps || !Array.isArray(parsedSequence.steps)) {
                setImportError("Invalid sequence format. Expected JSON with 'name' and 'steps' properties.");
                return;
            }

            // Check for duplicate names
            const duplicateExists = sequences.some(seq => 
                seq.name.toLowerCase() === parsedSequence.name.toLowerCase()
            );

            if (duplicateExists) {
                setImportError(`A sequence with the name "${parsedSequence.name}" already exists.`);
                return;
            }

            // Add the imported sequence
            const updatedSequences = [...sequences, parsedSequence];
            setSequences(updatedSequences);
            localStorage.setItem('sequences', JSON.stringify(updatedSequences));

            // Dispatch custom event to notify other components
            window.dispatchEvent(new CustomEvent('sequencesUpdated'));

            // Reset and close dialog
            setImportJson("");
            setImportError("");
            setIsImportDialogOpen(false);
        } catch (error) {
            setImportError("Invalid JSON format. Please check your input.");
        }
    }

    function removeSequence(idx: number) {
        const updatedSequences = sequences.filter((_, index) => index !== idx);
        setSequences(updatedSequences);
        localStorage.setItem('sequences', JSON.stringify(updatedSequences));

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('sequencesUpdated'));
    }

    return (
        <div className="p-4 border border-light rounded-sm w-[300px]">
            <p className="font-semibold text-sm text-center">Sequences</p>

            <Separator className="mt-4" />

            {sequences.length === 0 ? (
                <div className="px-4 py-2 rounded-sm text-muted-foreground my-4 italic">You have no recorded sequences..</div>
            ) : (
                <div className="my-2">
                    {sequences.map((seq, index) => (
                        <div key={index} className="p-3 rounded-sm flex justify-between items-center gap-8 hover:bg-muted cursor-pointer group">
                            <p
                                className="font-semibold cursor-pointer flex-1"
                                onClick={() => editSequence(seq)}
                                title="Click to edit sequence"
                            >
                                {seq.name}
                            </p>
                            <Button onClick={(e) => {
                                e.stopPropagation();
                                removeSequence(index);
                            }} variant={"destructive"} size={"icon"}><Trash /></Button>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={startNewSequence} className="w-full">Record Sequence</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Sequence" : "Record Sequence"}</DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Edit your sequence by adding or removing steps."
                                : "Record a sequence of builds/mouse clicks and give the sequence a name to repeat numerous times for building muscle memory and check"
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <SequenceForm
                        createSequence={createSequence}
                        editingSequence={editingSequence}
                        isEditing={isEditing}
                        existingSequences={sequences}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                <DialogTrigger asChild>
                    <Button 
                        onClick={() => {
                            setImportJson("");
                            setImportError("");
                            setIsImportDialogOpen(true);
                        }} 
                        className="w-full mt-2" 
                        variant="outline"
                    >
                        Import Sequence
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Sequence</DialogTitle>
                        <DialogDescription>
                            Paste the JSON data of a sequence to import it.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Input
                                placeholder="Paste sequence JSON here..."
                                value={importJson}
                                onChange={(e) => {
                                    setImportJson(e.target.value);
                                    if (importError) setImportError("");
                                }}
                                className={importError ? "border-red-500" : ""}
                            />
                            {importError && (
                                <p className="text-red-500 text-sm mt-1">{importError}</p>
                            )}
                        </div>
                        
                        <div className="flex space-x-2">
                            <Button 
                                onClick={importSequence}
                                disabled={!importJson.trim()}
                                className="flex-1"
                            >
                                Import
                            </Button>
                            <Button 
                                onClick={() => {
                                    setImportJson("");
                                    setImportError("");
                                    setIsImportDialogOpen(false);
                                }}
                                variant="outline"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default App
