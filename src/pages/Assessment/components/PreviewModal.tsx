
import {
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Divider,
    Button
} from "@heroui/react";

export default function PreviewModal({ open, onClose, payload, onConfirm }: { open: boolean; onClose: () => void; payload: any; onConfirm: () => void }) {
    return (
        <Modal isOpen={open} onOpenChange={onClose}>
            <ModalHeader>Preview Assessment</ModalHeader>
            <ModalBody>
                <div className="space-y-2">
                    <div className="font-semibold text-lg">{payload.title}</div>
                    <div className="text-sm text-kidemia-grey">{payload.description}</div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                        <div>
                            <div className="text-xs text-kidemia-grey">Code</div>
                            <div className="font-medium">{payload.code}</div>
                        </div>
                        <div>
                            <div className="text-xs text-kidemia-grey">Type</div>
                            <div className="font-medium">{payload.assessment_type}</div>
                        </div>

                        <div>
                            <div className="text-xs text-kidemia-grey">Price</div>
                            <div className="font-medium">
                                {payload.price} {payload.currency}
                                {payload.discount_price ? ` (discount ${payload.discount_price})` : ""}
                            </div>
                        </div>

                        <div>
                            <div className="text-xs text-kidemia-grey">Duration</div>
                            <div className="font-medium">{payload.duration_minutes} minutes</div>
                        </div>
                    </div>

                    <Divider />

                    <div>
                        <div className="text-sm font-semibold">Sections</div>
                        {payload.sections && payload.sections.length ? (
                            <div className="space-y-2 mt-2">
                                {payload.sections.map((s: any, i: number) => (
                                    <div key={i} className="p-2 border rounded">
                                        <div className="flex justify-between">
                                            <div className="font-medium">{s.title}</div>
                                            <div className="text-sm">{s.number_of_questions} questions</div>
                                        </div>
                                        <div className="text-xs text-kidemia-grey mt-1">Difficulty: {JSON.stringify(s.difficulty_distribution)}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-kidemia-grey mt-2">No sections defined.</div>
                        )}
                    </div>
                </div>
            </ModalBody>

            <ModalFooter>
                <div className="flex gap-2">
                    <Button variant="flat" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={onConfirm}>
                        Confirm & Create
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    );
}