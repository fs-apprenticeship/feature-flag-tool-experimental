import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react';
import { useDeleteEnvironment } from "../hooks/useDeleteEnvironment";
import { useState } from "react";
import Loader from "@/components/shared/Loader";

interface DeleteFormProps {
    orgSlug: string;
    projectSlug: string;
    envId: string;
}

export function DeleteEnvironmentDialog({
    orgSlug, 
    projectSlug,
    envId
}: DeleteFormProps ) {

    const { mutate, isPending } = useDeleteEnvironment(orgSlug, projectSlug);
    const [open, setOpen] = useState(false)

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault(); 

        mutate({ orgSlug, projectSlug, envId }, {
            onSuccess: () => {
                setOpen(false);
            },
             onError: (error) => {
            console.error("Submission failed:", error);
        }

        });
    };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button variant="ghost" size="icon" className="hover:text-red-600">  <Trash2 className="h-4 w-4" /> </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            environment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
          variant="destructive" 
          onClick={handleDelete} 
          disabled={isPending}>
             {isPending ? <Loader/> : <p> Delete </p>}
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
