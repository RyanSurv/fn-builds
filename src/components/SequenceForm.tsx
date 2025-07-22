import { useState, useRef } from "react"
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
    createSequence: (sequence: Sequence) => void
}

type Sequence = {
    name: string,
    steps: string[]
}

function SequenceForm(props: Props) {
    const nameRef = useRef<HTMLInputElement>(null);
    const [sequence, setSequence] = useState<string[]>([]);

    function addStep(step: string) {
        setSequence([...sequence, step]);
    }

    function removeStep(index: number) {
        setSequence(sequence.filter((_, idx) => idx !== index));
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
                <ol className="mt-4 space-y-4">
                    {sequence.map((step, idx) => {
                        return (
                            <li className="flex justify-between items-center space-x-2">
                                <p>{idx + 1}. {step}</p>
                                <Button variant={"destructive"} onClick={() => removeStep(idx)}>
                                    <Trash />
                                </Button>
                            </li>
                        )
                    })}
                </ol>
            </div>

            {sequence.length > 1 && <div className="mt-8 flex space-x-2">
                <Input placeholder="Sequence name.." ref={nameRef} />
                <Button onClick={() => props.createSequence({ name: nameRef.current?.value || "Unnamed", steps: sequence })}>Create</Button>
            </div>}
        </div>
    )
}

export default SequenceForm
