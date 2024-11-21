import {
  RiCloseLine,
  RiDeleteBin7Line,
  RiEditLine,
  RiSaveLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import {
  Modal,
  ModalContent,
  // ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  // useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";

export default function FormEditorButton({
  isEditingForm,
  setIsEditingForm,
  type,
  setIsAddingNewAddress,
  handleAddressDelete,
  handleAddressReset,
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (type === "update")
    // If this delivery address is old/updatable
    return isEditingForm ? (
      // Display canel and save buttons if form is being edited
      <div className="flex gap-2.5">
        <button className="flex items-center gap-1.5 rounded-md bg-[#d4ffce] p-1.5 font-semibold text-neutral-600 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-[#bdf6b4] hover:text-neutral-700 sm:p-2.5 [&_p]:text-xs max-sm:[&_p]:hidden max-sm:[&_svg]:size-4">
          <RiSaveLine className="text-base" />
          <p>Save</p>
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md bg-neutral-100 p-1.5 font-semibold text-neutral-600 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-neutral-200 hover:text-neutral-700 sm:p-2.5 [&_p]:text-xs max-sm:[&_p]:hidden max-sm:[&_svg]:size-4"
          onClick={() => {
            handleAddressReset();
            setIsEditingForm(false);
          }}
        >
          <RiCloseLine className="text-base" />
          <p>Cancel</p>
        </button>
      </div>
    ) : (
      // Display delete and edit buttons if form is not being edited
      <>
        {/* Buttons */}
        <div className="flex gap-2.5">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md bg-red-50 p-1.5 font-semibold text-neutral-600 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-red-100 hover:text-neutral-700 sm:p-2.5 [&_p]:text-xs max-sm:[&_p]:hidden max-sm:[&_svg]:size-4"
            onClick={() => setIsOpen(true)}
          >
            <RiDeleteBin7Line className="text-base" />
            <p>Delete</p>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md bg-neutral-100 p-1.5 font-semibold text-neutral-600 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-neutral-200 hover:text-neutral-700 sm:p-2.5 [&_p]:text-xs max-sm:[&_p]:hidden max-sm:[&_svg]:size-4"
            onClick={() => setIsEditingForm(true)}
          >
            <RiEditLine className="text-base" />
            <p>Edit</p>
          </button>
        </div>
        {/* Modal for confirmation of delete */}
        <Modal
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          size="xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <div className="mx-auto mb-6 mt-10 max-w-lg [&>*]:mx-auto [&>*]:w-fit">
                    <RiDeleteBin6Line className="size-24 text-[#F4D3BA]" />
                    <h4 className="mt-6 text-lg font-semibold text-neutral-600 hover:text-neutral-700">
                      Are your sure you want to delete this address?
                    </h4>
                    <p className="mt-2 text-center text-neutral-500 md:text-sm [&_p]:text-xs">
                      This address will be permanently removed from our
                      database. However, you can always add new addresses or
                      edit the existing addresses.
                    </p>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    type="button"
                    className="rounded-lg bg-neutral-50 px-5 py-3 font-semibold text-neutral-600 !opacity-100 transition-[background-color,color] duration-300 hover:bg-neutral-100 hover:text-neutral-700 md:text-sm [&_p]:text-xs"
                    onPress={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      handleAddressDelete();
                      setIsOpen(false);
                    }}
                    endContent={<RiDeleteBin6Line />}
                    className="rounded-lg bg-[#d4ffce] px-5 py-3 font-semibold text-neutral-600 !opacity-100 transition-[background-color,color] duration-300 hover:bg-[#bdf6b4] hover:text-neutral-700 md:text-sm [&_p]:text-xs"
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  // If this delivery address is new
  else
    return (
      <div className="flex gap-2.5">
        <button className="flex items-center gap-1.5 rounded-md bg-[#d4ffce] p-1.5 font-semibold text-neutral-600 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-[#bdf6b4] hover:text-neutral-700 sm:p-2.5 [&_p]:text-xs max-sm:[&_p]:hidden max-sm:[&_svg]:size-4">
          <RiSaveLine className="text-base" />
          <p>Save</p>
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md bg-neutral-100 p-1.5 font-semibold text-neutral-600 transition-[transform,color,background-color] duration-300 ease-in-out hover:bg-neutral-200 hover:text-neutral-700 sm:p-2.5 [&_p]:text-xs max-sm:[&_p]:hidden max-sm:[&_svg]:size-4"
          onClick={() => {
            handleAddressReset();
            setIsAddingNewAddress(false);
          }}
        >
          <RiCloseLine className="text-base" />
          <p>Cancel</p>
        </button>
      </div>
    );
}
