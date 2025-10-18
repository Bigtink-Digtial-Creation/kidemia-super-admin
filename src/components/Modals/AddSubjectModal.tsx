import { Button, Form, Input, Modal, ModalBody, ModalContent, Select, SelectItem, Textarea } from '@heroui/react'
import { MdOutlineFormatColorFill, MdOutlineMessage, MdSubject } from 'react-icons/md';
import { PiBarcode } from 'react-icons/pi';
import { colors } from '../../staticData';

interface AddSubjectModalI {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}

export default function AddSubjectModal({ isOpen, onOpenChange, onClose }: AddSubjectModalI) {
  return (
    <Modal size='xl' isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
      <ModalContent>
        <ModalBody className='py-8'>
          <div className='flex flex-col justify-center px-4 space-y-4'>
            <div className='space-y-1'>
              <h3 className='text-kidemia-primary text-2xl font-semibold text-center'>Add a Subject</h3>
              <p className='text-kidemia-grey text-md text-center '>Fill the form to add a subject</p>
            </div>

            <Form className='py-4 space-y-2'>
              <div className='pb-2 w-full'>
                <Input variant='flat' size='lg' radius='sm' placeholder='Name of subject' startContent={<MdSubject className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />} type='text' />
              </div>

              <div className='pb-2 w-full'>
                <Input variant='flat' size='lg' radius='sm' placeholder='Subject Code' startContent={<PiBarcode className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />} type='text' />
              </div>
              <div className='pb-2 w-full'>
                <Select variant='flat' size='lg' radius='sm' placeholder='Subject Colour' startContent={<MdOutlineFormatColorFill className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />}>
                  {colors.map((color) => (
                  <SelectItem key={color.key}>{color.label}</SelectItem>
                  ) )}
                </Select>
              </div>

              <div className='pb-2 w-full'>
                <Textarea variant='flat' size='lg' radius='sm' placeholder='Subject Description' startContent={<MdOutlineMessage className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />}/>
              </div>

              <div className='py-4 w-full'>
                <Button
                  type="submit"
                  variant="solid"
                  size="lg"
                  className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
                  radius="sm"
                >
                  Add Subject
                </Button>
              </div>
            </Form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
