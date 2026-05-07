import { useEditEnvironment } from "../hooks/useEditEnvironment";
import Loader from "@/components/shared/Loader";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil } from 'lucide-react';
import EnvironmentForm from "./EnvironmentForm";
import { Button } from "@/components/ui/button";
import { EnvironmentInput } from "../models/Environment";


interface EditEnvProps {
    projectSlug: string
    orgSlug: string
    initialData: EnvironmentInput;
    envId: string;
}

export default function EditEnvDialog({projectSlug,orgSlug, initialData, envId}: EditEnvProps) {
    const [open, setOpen] = useState(false);
    const { mutate, isPending, error } = useEditEnvironment(orgSlug, projectSlug);
    const errorMessage = (error as Error)?.message;
   
    return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
                <Button variant="ghost" size="icon" className="hover:text-blue-600">
                <Pencil className="h-4 w-4" />
            </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Create Environment</DialogTitle>
                    <DialogDescription>
                   Use environments to maintain separate rollout rules in different contexts, from local to production.
                    </DialogDescription>
                </DialogHeader>
               <EnvironmentForm 
                    formId={`edit-env-${envId}`}
                    initialData={initialData}
                    onSubmit={(formData) => {
                        mutate(
                            { 
                                envId, 
                                data: formData, 
                                projectSlug, 
                                orgSlug 
                            }, 
                            { 
                                onSuccess: () => setOpen(false) 
                            }
                        );
                    }} 
    errorMessage={errorMessage}
/>
                <DialogFooter>
                    <DialogClose>
                    <Button variant="outline">Cancel</Button>
                    </DialogClose>
      
                    <Button type="submit" form={`edit-env-${envId}`} disabled={isPending}>
                      {isPending ? 
                          <Loader/> : <p> Update </p> }
                      </Button>
                                    
                </DialogFooter>
                </DialogContent>
            </Dialog>
            )

}

