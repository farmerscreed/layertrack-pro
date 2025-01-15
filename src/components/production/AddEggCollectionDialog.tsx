import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { EggCollectionForm } from "./EggCollectionForm";
import { useEggCollection } from "./useEggCollection";
import type { z } from "zod";
import type { formSchema } from "./EggCollectionForm";

export function AddEggCollectionDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { batches, staff, isLoading, addEggCollection } = useEggCollection();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await addEggCollection.mutateAsync(values);
      toast({
        title: "Collection Record Added",
        description: "The egg collection record has been saved successfully.",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save egg collection record. Please try again.",
        variant: "destructive",
      });
      console.error('Error adding egg collection:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="fixed md:static top-4 right-4 z-50 md:z-0 h-8 px-3 md:h-10 md:px-4 md:py-2"
        >
          Add Collection
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Egg Collection Record</DialogTitle>
          <DialogDescription>Enter collection details.</DialogDescription>
        </DialogHeader>
        <EggCollectionForm
          onSubmit={handleSubmit}
          isSubmitting={addEggCollection.isPending}
          batches={batches}
          staff={staff}
        />
      </DialogContent>
    </Dialog>
  );
}