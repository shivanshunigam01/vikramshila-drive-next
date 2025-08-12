import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { openEnquiryDialog } from "@/components/common/EnquiryDialog";

export default function FloatingCTAs() {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-40">
      <Button variant="hero" className="shadow-elegant" onClick={() => openEnquiryDialog()}>
        <MessageSquare /> Enquire Now
      </Button>
    </div>
  );
}
