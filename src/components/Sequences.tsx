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
import SequenceForm from "@/components/SequenceForm"

function App() {
    const [sequences, setSequences] = useState<{ name: string, steps: string[] }[]>([]);

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
        const updatedSequences = [...sequences, sequence];
        setSequences(updatedSequences);
        localStorage.setItem('sequences', JSON.stringify(updatedSequences));

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('sequencesUpdated'));
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
            <p className="font-bold">Sequences</p>

            {sequences.length === 0 ? (
                <div className="px-4 py-2 rounded-sm text-muted-foreground my-4 italic">You have no recorded sequences..</div>
            ) : (
                <div className="my-4">
                    {sequences.map((seq, index) => (
                        <div key={index} className="p-3 rounded-sm flex justify-between items-center gap-8 hover:bg-muted">
                            <p className="font-semibold">{seq.name}</p>
                            <Button onClick={() => removeSequence(index)} variant={"destructive"} size={"icon"}><Trash /></Button>
                        </div>
                    ))}
                </div>
            )}

            <Dialog>
                <DialogTrigger><Button>Record Sequence</Button></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Record Sequence</DialogTitle>
                        <DialogDescription>
                            Record a sequence of builds/mouse clicks and give the sequence a name to repeat numerous times for building muscle memory and check accuracy.
                        </DialogDescription>
                    </DialogHeader>

                    <SequenceForm createSequence={createSequence} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default App
