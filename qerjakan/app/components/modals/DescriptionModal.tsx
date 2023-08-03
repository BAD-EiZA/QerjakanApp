'use client';
import axios from 'axios';
import { 
  FieldValues, 
  SubmitHandler, 
  useForm
} from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import Modal from "./Modal";
import useNameModal from '@/app/hooks/useNameModal';
import Input from '../inputs/Input';
import Heading from '../Heading';
import Swal from 'sweetalert2';
import useDescriptionModal from '@/app/hooks/useDescription';

const DescriptionModal = () => {
    const router = useRouter();
    const descModal = useDescriptionModal();
    const [isLoading, setIsLoading] = useState(false);
    const { 
        register, 
        handleSubmit,
        formState: {
          errors,
        },
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
          description: '',
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.patch('/api/editdescription', data)
        .then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Update Description Profile Success',
            showConfirmButton: false,
            timer: 1500
        })
        reset();
        router.refresh();
        descModal.onClose();
        })
        .catch(() => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        })
        .finally(() => {
            setIsLoading(false);
        })
    }   
    
    const bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title="Description profiles"
                subtitle="Update your description profiles"
            />
            <Input
                id="description"
                label="Description"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    )

    return (
        <Modal
        disabled={isLoading}
        isOpen={descModal.isOpen}
        title='Update Profiles'
        actionLabel='Update'
        onClose={descModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body= {bodyContent}
        />
    )
}

export default DescriptionModal