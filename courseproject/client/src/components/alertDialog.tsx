import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  useClipboard,
  Button,
  Flex,
  Input,
  FormLabel
} from "@chakra-ui/react";
import React, { useRef } from "react";
import axios from "axios";

export function Alertdg(props: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onCopy, value, setValue, hasCopied } = useClipboard("4000002500003155");
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button onClick={onOpen}>Buy</Button>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader color={"green"}>Payment Confirmation</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Use Below <b>Test Card</b> for Smooth Payment Experience
            <br/><br/>
            <FormLabel>Card Number</FormLabel>
            <Flex mb={2}>
              <Input
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                mr={2}
              />
              <Button onClick={onCopy}>{hasCopied ? "Copied!" : "Copy"}</Button>
            </Flex>
            <br/>
            <span style={{fontSize : "small"}}><b>CVV</b> and <b>Expiry Date</b> Of Your Choice</span> 
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              cancel
            </Button>
            <Button
              colorScheme="green"
              ml={3}
              onClick={async () => {
                try {
                  const res = await axios.post(
                    `${
                      import.meta.env.VITE_BACKEND_URL
                    }/create-checkout-session`,
                    {
                      coursedata: {
                        title: props.title,
                        price: props.price,
                        id: props.id,
                      },
                    }
                  );
                  console.log(res.status);
                  if (res.status == 200) {
                    window.location.href = res.data.url;
                  }
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              continue payment
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
