import { useCreateEnvironment } from "../hooks/useCreateEnvironments";
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
import { PlusIcon } from 'lucide-react';
import EnvironmentForm from "./EnvironmentForm";
import { Button } from "@/components/ui/button";


interface CreateEnvProps {
    projectSlug: string
    orgSlug: string
}

export default function CreateEnvDialog({projectSlug,orgSlug}: CreateEnvProps) {
    const [open, setOpen] = useState(false);
    const { mutate, isPending, error } = useCreateEnvironment(orgSlug, projectSlug);
    const errorMessage = (error as Error)?.message;
   
    return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
                <Button variant="outline"> <PlusIcon/>Create Environment</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Create Environment</DialogTitle>
                    <DialogDescription>
                   Use environments to maintain separate rollout rules in different contexts, from local to production.
                    </DialogDescription>
                </DialogHeader>
               <EnvironmentForm 
                    formId = "create-env"
                    onSubmit={(formData) => {
                        mutate({ projectSlug, orgSlug, data: formData }, { 
                            onSuccess: () => setOpen(false) 
                        });
                    }} 
                    errorMessage={errorMessage}
                />
                <DialogFooter>
                    <DialogClose>
                    <Button variant="outline">Cancel</Button>
                    </DialogClose>
      
                    <Button type="submit" form="create-env" disabled={isPending}>
                      {isPending ? 
                          <Loader/> : <p> Create </p> }
                      </Button>
                                    
                </DialogFooter>
                </DialogContent>
            </Dialog>
            )

}

