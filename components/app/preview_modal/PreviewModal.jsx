import { Dialog, Button, Flex, Text, TextField,  } from '@radix-ui/themes';
import MyPreview from '@/components/app/preview_modal/MyPreview'

export default function PreviewModal({source}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button style={{borderRadius: "0px"}}>Preview Video</Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Preview</Dialog.Title>
        <Flex justify="center" >
          <MyPreview source={source}></MyPreview>
        </Flex>

        <Flex justify="end" style={{margin: "10px"}}>
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
      </Flex>
  </Dialog.Content>
</Dialog.Root>
  )
}