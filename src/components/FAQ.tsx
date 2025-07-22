import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

function FAQ() {
    return (
        <div className="p-4 border border-muted rounded-sm">
            <h1 className="text-2xl font-bold mb-4">Frequently Asked Questions</h1>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>What is FN Builds?</AccordionTrigger>
                    <AccordionContent>
                        FN Builds is a practice tool designed to help Fortnite players improve their building muscle memory.
                        You can create custom building sequences, practice them with precise timing, and track your progress
                        with detailed statistics including accuracy, speed, and consistency metrics.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger>How do I set up my keybinds?</AccordionTrigger>
                    <AccordionContent>
                        Go to the Keybinds section and click the pencil icon next to each build type (Wall, Floor, Ramp, Cone, Edit).
                        When prompted, press the key or mouse button you use for that building piece in Fortnite. You can also set
                        a Reset keybind to quickly restart sequences during practice. Don't forget to click "Save" when you're done!
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger>How do I create a building sequence?</AccordionTrigger>
                    <AccordionContent>
                        In the Sequences section, click "Record Sequence". Add building steps by clicking the Wall, Floor, Ramp,
                        Cone, Edit, or LMB buttons. You can drag and drop steps to reorder them. Give your sequence a descriptive
                        name (like "90s", "Double Edit", or "Retake") and click "Create" when finished.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                    <AccordionTrigger>What's the difference between Play and Play Loop?</AccordionTrigger>
                    <AccordionContent>
                        "Play" runs the sequence once and stops when completed. "Play Loop" automatically restarts the sequence
                        after completion, allowing continuous practice without manual intervention. Loop mode is perfect for
                        building muscle memory as you can practice the same sequence repeatedly while seeing your performance
                        stats update in real-time.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                    <AccordionTrigger>What are ignored keys and when should I use them?</AccordionTrigger>
                    <AccordionContent>
                        Ignored keys are inputs that won't be recorded during practice. Add keys like W, A, S, D (movement),
                        Escape, Tab, or any other keys you might accidentally press during practice. This prevents accidental
                        inputs from ruining your sequence attempts. Separate multiple keys with commas.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10">
                    <AccordionTrigger>My side mouse buttons are changing the page?</AccordionTrigger>
                    <AccordionContent>
                        This is default behavior for most browsers. If you load the website from an external link, opening the site
                        with no previous/next page to navigate to you should be able to run your sequences with your side mouse buttons
                        without issue. To do so, CTRL + click <a href="https://fn-build-repeater.netlify.app/" target="_blank"><p className="text-primary underline inline">this link</p></a>.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default FAQ
