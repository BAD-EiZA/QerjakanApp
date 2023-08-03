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

const NameModal = () => {
    const router = useRouter();
    const nameModal = useNameModal();
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
          name: '',
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.patch('/api/editname', data)
        .then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Update Name Profile Success',
            showConfirmButton: false,
            timer: 1500
        })
        reset();
        router.refresh();
        nameModal.onClose();
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
                title="Name profiles"
                subtitle="Update your name profiles"
            />
            <Input
                id="name"
                label="Name"
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
        isOpen={nameModal.isOpen}
        title='Update Profiles'
        actionLabel='Update'
        onClose={nameModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body= {bodyContent}
        />
    )
}

export default NameModal