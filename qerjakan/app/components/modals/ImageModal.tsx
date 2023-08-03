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
import useImageModal from '@/app/hooks/useImageModal';
import ImageUpload from '../inputs/ImageUpload';
import Heading from '../Heading';
import Swal from 'sweetalert2';

const ImageModal = () => {
    const router = useRouter();
    const imageModal = useImageModal();
    const [isLoading, setIsLoading] = useState(false);
    const { 
        register, 
        handleSubmit,
        setValue,
        watch,
        formState: {
          errors,
        },
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
          image: '',
        }
    });
    const image = watch('image');

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true
        })
    }
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        const res = axios.patch('/api/editprofileimage', data)
        .then((res) => {
            if(res.data.statusCode === 200){
                Swal.fire({
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                reset();
                router.refresh();
                imageModal.onClose();
            }
            else if(res.data.statusCode === 401){
                Swal.fire({
                    icon: 'error',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                reset();
                imageModal.onClose();
                router.push('/');
                
            }
        
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
                title="Photo profiles"
                subtitle="Update your photo profiles"
            />
            <ImageUpload
                onChange={(value) => setCustomValue('image', value)}
                value={image}
            />
        </div>
    )

    return (
        <Modal
        disabled={isLoading}
        isOpen={imageModal.isOpen}
        title='Update Profiles'
        actionLabel='Update'
        onClose={imageModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body= {bodyContent}
        />
    )
}

export default ImageModal