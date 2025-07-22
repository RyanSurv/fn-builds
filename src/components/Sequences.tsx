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
import SequenceForm from "@/components/SequenceForm"

function App() {
    const [sequences, setSequences] = useState<{ name: string, steps: string[] }[]>([]);
    const [editingSequence, setEditingSequence] = useState<{ name: string, steps: string[] } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default App
