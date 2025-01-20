import { deleteNote } from "@/db/actions";
import { useRouter } from "@/hooks/use-router";
import { useNotesStore } from "@/stores/notes";
import {
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { MoreVerticalIcon } from "lucide-react";
import { useParams } from "next/navigation";

type Props = {
  noteId?: number;
};

export default function NoteDropdownMenu({ noteId: defaultNoteId }: Props) {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const params = useParams();
  const noteId = defaultNoteId ?? Number(params.noteId);
  const deleteNoteStore = useNotesStore((state) => state.deleteNote);
  const { isPending, mutate } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      deleteNoteStore(noteId);
      router.push("/notes");
    },
  });
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Delete Note</ModalHeader>
          <ModalBody>Are you sure you want to delete this note?</ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="danger"
              isLoading={isPending || router.isNavigating}
              onPress={() => void mutate(noteId)}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Dropdown className="min-w-32">
        <DropdownTrigger>
          <Button size="sm" variant="light" isIconOnly>
            <MoreVerticalIcon size={16} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            onPress={onOpen}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
