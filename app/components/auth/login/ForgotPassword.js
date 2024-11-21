import createErrorMessage from "@/app/utils/createErrorMessage";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { auth } from "@/firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLoading } from "@/app/contexts/loading";

export default function ForgotPassword() {
  const { setIsPageLoading } = useLoading();
  const emailRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Function that sends a password reset email
  const handlePasswordReset = async () => {
    if (!emailRef?.current?.value) {
      toast.error("Email field cannot be empty.", {
        position: "bottom-left",
        style: {
          background: "black",
          color: "white",
          // margin: "20px",
        },
      });
      return;
    } else if (
      !/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(emailRef?.current?.value)
    ) {
      toast.error("Please enter a valid email address.", {
        position: "bottom-left",
        style: {
          background: "black",
          color: "white",
          // margin: "20px",
        },
      });
      return;
    }

    setIsPageLoading(true);

    try {
      // Attempt to send a password reset email to the user's email address
      await sendPasswordResetEmail(auth, emailRef?.current?.value);
      toast.success("Email with password reset link sent.", {
        position: "bottom-left",
        style: {
          background: "black",
          color: "white",
          // margin: "20px",
        },
      });
      setIsOpen(false);
    } catch (error) {
      toast.error(createErrorMessage(error), {
        position: "bottom-left",
        style: {
          background: "black",
          color: "white",
          // margin: "20px",
        },
      });
    }

    setIsPageLoading(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-xs font-semibold text-[#57944e] transition-[color] duration-300 ease-in-out hover:text-[#6cb461]"
      >
        Forgot password?
      </button>
      <Modal isOpen={isOpen} onOpenChange={setIsOpen} scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reset Password
              </ModalHeader>
              <ModalBody className="-mt-5">
                <p className="mb-5 text-sm text-neutral-500">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim
                  ullam aliquid consequatur.
                </p>
                <div className="w-full space-y-2 font-semibold">
                  <label htmlFor="email">Email</label>
                  <input
                    ref={emailRef}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@gmail.com"
                    className="h-11 w-full rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]"
                    required
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  onClick={handlePasswordReset}
                  className="rounded-lg bg-[#d4ffce] px-5 py-3 text-xs font-semibold text-neutral-600 !opacity-100 transition-[background-color,color] duration-300 hover:bg-[#bdf6b4] hover:text-neutral-700 md:text-sm"
                >
                  Send Email
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
