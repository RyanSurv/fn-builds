import { useState, useEffect } from "react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "./ui/button";

type Sequence = {
    name: string, steps: string[]
}

function Play() {
    const [sequences, setSequences] = useState<Sequence[]>([]);
    const [selectedSequence, setSelectedSequence] = useState<Sequence | null>(null);
    const [inputs, setInputs] = useState<String[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [keybinds, setKeybinds] = useState<{ [key: string]: string }>({});
    const [ignoredKeys, setIgnoredKeys] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [completionTime, setCompletionTime] = useState<number | null>(null);
    const [stats, setStats] = useState<{ [sequenceName: string]: { totalAttempts: number, totalTime: number, totalAccuracy: number, perfectAttempts: number } }>({});

    // Function to load keybinds from localStorage
    const loadKeybinds = () => {
        const savedKeybinds = localStorage.getItem('keybinds');
        if (savedKeybinds) {
            try {
                const parsedKeybinds = JSON.parse(savedKeybinds);
                setKeybinds(parsedKeybinds);

                // Parse ignored keys from comma-separated string
                const ignoredKeysString = parsedKeybinds.ignoredKeys || "";
                const ignoredKeysArray = ignoredKeysString
                    .split(',')
                    .map((key: string) => key.trim())
                    .filter((key: string) => key.length > 0);
                setIgnoredKeys(ignoredKeysArray);
            } catch (error) {
                console.error('Failed to load keybinds from localStorage:', error);
            }
        }
    };

    // Function to load sequences from localStorage
    const loadSequences = () => {
        const savedSequences = localStorage.getItem('sequences');
        if (savedSequences) {
            try {
                const parsedSequences = JSON.parse(savedSequences);
                setSequences(parsedSequences);
            } catch (error) {
                console.error('Failed to load sequences from localStorage:', error);
            }
        }
    };

    // Load sequences and keybinds from localStorage on component mount
    useEffect(() => {
        loadSequences();
        loadKeybinds();

        const savedStats = localStorage.getItem('playStats');
        if (savedStats) {
            try {
                const parsedStats = JSON.parse(savedStats);
                setStats(parsedStats);
            } catch (error) {
                console.error('Failed to load stats from localStorage:', error);
            }
        }

        // Listen for custom keybinds update event
        const handleKeybindsUpdate = () => {
            loadKeybinds();
        };

        // Listen for custom sequences update event
        const handleSequencesUpdate = () => {
            loadSequences();
        };

        window.addEventListener('keybindsUpdated', handleKeybindsUpdate);
        window.addEventListener('sequencesUpdated', handleSequencesUpdate);

        // Cleanup listeners on unmount
        return () => {
            window.removeEventListener('keybindsUpdated', handleKeybindsUpdate);
            window.removeEventListener('sequencesUpdated', handleSequencesUpdate);
        };
    }, []);

    // Function to map input to keybind name
    const mapInputToKeybind = (input: string): string => {
        // Create reverse mapping from keybind value to name
        const reverseMapping: { [key: string]: string } = {};
        Object.entries(keybinds).forEach(([name, value]) => {
            if (value) {
                reverseMapping[value] = name;
            }
        });

        // Check for special cases
        if (input === "Mouse0") return "lmb";

        // Return mapped keybind name or original input if not found
        return reverseMapping[input] || input;
    };

    // Set up input listeners when playing
    useEffect(() => {
        if (!isPlaying || !selectedSequence) return;

        const handleKeyPress = (event: KeyboardEvent) => {
            if (inputs.length >= selectedSequence.steps.length) return;

            const key = event.key.length === 1 ? event.key.toUpperCase() : event.code;

            // Check if this key should be ignored
            if (ignoredKeys.includes(key) || ignoredKeys.includes(event.key)) {
                return; // Don't prevent default, just ignore this key
            }

            event.preventDefault();

            // Start timing on first input
            if (inputs.length === 0) {
                setStartTime(Date.now());
                setCompletionTime(null);
            }

            setInputs(prev => [...prev, key]);
        };

        const handleMousePress = (event: MouseEvent) => {
            if (inputs.length >= selectedSequence.steps.length) return;

            const mouseButton = `Mouse${event.button}`;

            // Check if this mouse button should be ignored
            if (ignoredKeys.includes(mouseButton)) {
                return; // Don't prevent default, just ignore this button
            }

            // Check if the click is on a button element (to ignore UI interactions)
            const target = event.target as HTMLElement;
            if (target && (target.tagName === 'BUTTON' || target.closest('button'))) {
                return; // Don't record clicks on buttons
            }

            event.preventDefault();

            // Start timing on first input
            if (inputs.length === 0) {
                setStartTime(Date.now());
                setCompletionTime(null);
            }

            setInputs(prev => [...prev, mouseButton]);
        };

        // Add event listeners
        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('mousedown', handleMousePress);

        // Cleanup function to remove listeners
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
            document.removeEventListener('mousedown', handleMousePress);
        };
    }, [isPlaying, selectedSequence, inputs.length]);

    // Reset inputs when starting to play or changing sequence
    useEffect(() => {
        if (isPlaying) {
            setInputs([]);
            setStartTime(null);
            setCompletionTime(null);
        }
    }, [isPlaying, selectedSequence]);

    // Stop playing when inputs limit is reached and calculate completion time
    useEffect(() => {
        if (selectedSequence && inputs.length >= selectedSequence.steps.length && inputs.length > 0) {
            if (startTime) {
                const endTime = Date.now();
                const time = endTime - startTime;
                setCompletionTime(time);

                // Calculate accuracy and update stats
                const accuracy = calculateAccuracy();
                const sequenceName = selectedSequence.name;

                setStats(prevStats => {
                    const currentStats = prevStats[sequenceName] || { totalAttempts: 0, totalTime: 0, totalAccuracy: 0, perfectAttempts: 0 };
                    const isPerfect = accuracy === 100;
                    const newStats = {
                        ...prevStats,
                        [sequenceName]: {
                            totalAttempts: currentStats.totalAttempts + 1,
                            totalTime: currentStats.totalTime + time,
                            totalAccuracy: currentStats.totalAccuracy + accuracy,
                            perfectAttempts: currentStats.perfectAttempts + (isPerfect ? 1 : 0)
                        }
                    };

                    // Save to localStorage
                    localStorage.setItem('playStats', JSON.stringify(newStats));
                    return newStats;
                });
            }
            setIsPlaying(false);
        }
    }, [inputs.length, selectedSequence, startTime]);

    // Calculate accuracy percentage
    const calculateAccuracy = (): number => {
        if (!selectedSequence || inputs.length === 0) return 0;

        let correctInputs = 0;
        for (let i = 0; i < Math.min(inputs.length, selectedSequence.steps.length); i++) {
            const mappedInput = mapInputToKeybind(inputs[i] as string);
            if (mappedInput === selectedSequence.steps[i]) {
                correctInputs++;
            }
        }

        return Math.round((correctInputs / selectedSequence.steps.length) * 100);
    };

    // Get average stats for current sequence
    const getAverageStats = () => {
        if (!selectedSequence || !stats[selectedSequence.name]) return null;

        const sequenceStats = stats[selectedSequence.name];
        const avgTime = (sequenceStats.totalTime / sequenceStats.totalAttempts) / 1000; // Convert to seconds
        const avgAccuracy = sequenceStats.totalAccuracy / sequenceStats.totalAttempts;

        return {
            attempts: sequenceStats.totalAttempts,
            avgTime: avgTime.toFixed(2),
            avgAccuracy: Math.round(avgAccuracy),
            perfectAttempts: sequenceStats.perfectAttempts || 0
        };
    };

    // Clear stats for current sequence
    const clearStats = () => {
        if (!selectedSequence) return;

        setStats(prevStats => {
            const newStats = { ...prevStats };
            delete newStats[selectedSequence.name];
            localStorage.setItem('playStats', JSON.stringify(newStats));
            return newStats;
        });
    };

    return (
        <div className="p-4 border border-muted rounded-sm flex-grow">
            <ActionBar sequences={sequences} setSelectedSequence={setSelectedSequence} isPlaying={isPlaying} setIsPlaying={setIsPlaying} selectedSequence={selectedSequence} setInputs={setInputs} />

            {selectedSequence && (
                <div className="">
                    <div className="flex flex-wrap gap-1 mt-4">
                        <p className="text-muted-foreground">Sequence Steps:</p>
                        {selectedSequence.steps.map((step, idx) => {
                            const mappedInput = inputs[idx] ? mapInputToKeybind(inputs[idx] as string) : null;
                            const isCorrect = mappedInput === step;
                            const hasInput = idx < inputs.length;

                            return (
                                <div key={idx} className="flex gap-1">
                                    <p className={hasInput ? (isCorrect ? "text-green-500" : "text-red-500") : ""}>
                                        {step}
                                    </p>
                                    {idx !== selectedSequence.steps.length - 1 && <p>&gt;</p>}
                                </div>
                            )
                        })}
                    </div>

                    {(isPlaying || inputs.length) &&
                        <div>
                            <div className="flex flex-wrap gap-1 mt-4">
                                <p className="text-muted-foreground">Inputted Steps:</p>
                                {inputs.map((step, idx) => {
                                    const mappedStep = mapInputToKeybind(step as string);
                                    const expectedStep = selectedSequence.steps[idx];
                                    const isCorrect = mappedStep === expectedStep;

                                    return (
                                        <div key={idx} className="flex gap-1">
                                            <p className={isCorrect ? "text-green-500" : "text-red-500"}>
                                                {mappedStep}
                                            </p>
                                            {idx !== inputs.length - 1 && <p>&gt;</p>}
                                        </div>
                                    )
                                })}
                            </div>

                            {completionTime && (
                                <div className="mt-4 space-y-4">
                                    <p className="text-muted-foreground">
                                        Completion Time: <span className="text-foreground font-semibold">{(completionTime / 1000).toFixed(2)}s</span>
                                    </p>
                                    <p className="text-muted-foreground">
                                        Accuracy: <span className="text-foreground font-semibold">{calculateAccuracy()}%</span>
                                    </p>
                                    {getAverageStats() && (
                                        <>
                                            <Separator className="mt-8" />
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-2">Average Stats ({getAverageStats()!.attempts} attempts):</p>
                                                    <div className="flex gap-4">
                                                        <p className="text-sm text-muted-foreground">
                                                            Avg Time: <span className="text-foreground font-medium">{getAverageStats()!.avgTime}s</span>
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Avg Accuracy: <span className="text-foreground font-medium">{getAverageStats()!.avgAccuracy}%</span>
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Perfect: <span className="text-foreground font-medium">{getAverageStats()!.perfectAttempts}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm" onClick={clearStats}>
                                                    Clear Stats
                                                </Button>
                                            </div>

                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    }
                </div>
            )}
        </div>
    )
}

function ActionBar({ sequences, setSelectedSequence, isPlaying, setIsPlaying, selectedSequence, setInputs }: { sequences: Sequence[], setSelectedSequence: (setSelectedSequence: Sequence) => void, isPlaying: boolean, setIsPlaying: (isPlaying: boolean) => void, selectedSequence: Sequence | null, setInputs: (inputs: string[]) => void }) {
    function sequenceChange(value: string) {
        setSelectedSequence(sequences.find(sequence => sequence.name === value)!);
        setIsPlaying(false);
        setInputs([]);
    }

    return (
        <div className="flex space-x-4">
            <Select onValueChange={(value) => sequenceChange(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Sequence" />
                </SelectTrigger>
                <SelectContent>
                    {sequences.length === 0 ? (
                        <SelectItem value="no-sequences" disabled>No sequences available</SelectItem>
                    ) : (
                        sequences.map((sequence, index) => (
                            <SelectItem key={index} value={sequence.name}>
                                {sequence.name}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>

            <div className="flex space-x-2">
                <Button disabled={isPlaying || !selectedSequence} onClick={() => setIsPlaying(true)}>Play</Button>
                <Button variant={"destructive"} disabled={!isPlaying} onClick={() => setIsPlaying(false)}>Stop</Button>
            </div>
        </div>
    )
}

export default Play
