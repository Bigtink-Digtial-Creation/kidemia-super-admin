import { Form, Modal, ModalBody, ModalContent, Spinner } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { QueryKeys } from '../../utils/queryKeys';
import { ApiSDK } from '../../sdk';

interface UpdateTopicModalI {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  topic_id: string;
  name: string;
}
export default function UpdateTopicModal({
  isOpen,
  onClose,
  onOpenChange,
  topic_id,
  name,
}: UpdateTopicModalI) {

  const { data: singleTopic, isLoading } = useQuery({
    queryKey: [QueryKeys.topicById, topic_id],
    queryFn: () => ApiSDK.SubjectTopicsService.getTopicApiV1TopicsTopicIdGet(topic_id),
    enabled: !!topic_id
  })

  console.log(singleTopic);
  const onSubmit = () => {
    onClose()
  }

  return (
    <Modal size="md" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalBody className='py-8'>
          <div className="flex flex-col justify-center px-4 space-y-4">
            <div className="space-y-1">
              <h3 className="text-kidemia-primary text-2xl font-semibold text-center capitalize">
                Update {name} Details
              </h3>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Spinner size="lg" color="warning" />
              </div>
            ) : (
              <Form onSubmit={onSubmit} className='py-4 space-y-2'>
                helloe man
              </Form>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
