"use client"
import axios from 'axios';
import { 
  FieldValues, 
  SubmitHandler, 
  useForm
} from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from "react";
import useAddServiceModal from '@/app/hooks/useAddServiceModal';
import Modal from "./Modal";
import Input from '../inputs/Input';
import Heading from '../Heading';
import Swal from 'sweetalert2';
import ImageUpload from '../inputs/ImageUpload';
import Selector from '../inputs/Selector';
import useSubCat from '@/app/hooks/useSubCat';

enum STEPS {
  TITLE = 0,
  DESCRIPTION = 1,
  CATEGORY = 2,
  IMAGE = 3,
  PRICE = 4,
  DAYDELIVERED = 5,
  REVISIONS = 6
}


const AddServiceModal =  () => {
    const serviceModal = useAddServiceModal();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(STEPS.TITLE);
    
    const {data: allSubCat = []} = useSubCat()
    const optionSubCat = allSubCat.map((sub:any) => ({
      value: sub.id,
      label: sub.subcategory_name
    }))
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
        title: '',
        description: '',
        category: '',
        image: '',
        price: 0,
        deliveryTime: 0,
        subCategoryId:'',
        revisions: 0
      }
    });
    
    const category = watch('category');
    const image = watch('image');
    const price = watch('price');
    const dayDelivered = watch('dayDelivered');
    const subCategoryId = watch('subCategoryId');
    const revisions = watch('revisions')

    
    const onBack = () => {
      setStep((value) => value - 1);
    }
  
    const onNext = () => {
      setStep((value) => value + 1);
    }

    const setCustomValue = (id: string, value: any) => {
      setValue(id, value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      })
    }
  
    const actionLabel = useMemo(() => {
      if (step === STEPS.REVISIONS) {
        return 'Create'
      }
  
      return 'Next'
    }, [step]);

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
      if (step !== STEPS.REVISIONS) {
        return onNext();
      }
      setIsLoading(true);
  
      axios.post('/api/addservice', data)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Create Services Success',
          showConfirmButton: false,
          timer: 1500
      })
      reset();
      setStep(STEPS.TITLE)
      
      serviceModal.onClose();
      router.refresh();
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
    
    const secondaryActionLabel = useMemo(() => {
      if (step === STEPS.TITLE) {
        return undefined
      }
  
      return 'Back'
    }, [step]);

   
  const stepContent = {
    [STEPS.TITLE]: (
      <div className="flex flex-col gap-8">
        <Heading
          title="Title services"
          subtitle="Create title for your service"
        />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    ),
    [STEPS.DESCRIPTION]: (
      <div className="flex flex-col gap-8">
        <Heading
          title="Description services"
          subtitle="Create description for your service"
        />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    ),
    [STEPS.CATEGORY]:(
      <div className="flex flex-col gap-8">
        <Heading
        title="Category services"
        subtitle="Select category for your service"
        />
        <Selector 
        errors={errors}register={register}
        idSelector='subCategoryId'
        value={subCategoryId}
        onChange={(value) => setCustomValue('subCategoryId', value)}
        fillOptions={optionSubCat}
        placeHolder='Category Service' />
        
        
      </div>
    ),
    [STEPS.IMAGE] : (
      <div className="flex flex-col gap-8">
        <Heading
        title="Image services"
        subtitle="Select image for your service"
        />
        <ImageUpload
          onChange={(value) => setCustomValue('image', value)}
          value={image}
        />
      </div>
    ),
    [STEPS.PRICE] : (
      <div className="flex flex-col gap-8">
        <Heading
        title="Prices services"
        subtitle="Set price for your service"
        />
        <Input
          id="price"
          label="Price"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    ),
    [STEPS.DAYDELIVERED] : (
      <div className="flex flex-col gap-8">
        <Heading
        title="Day Delivered services"
        subtitle="Set deliver day for your service"
        />
        <Input
          id="deliveryTime"
          label="Day Delivered"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    ),
    [STEPS.REVISIONS] : (
      <div className="flex flex-col gap-8">
        <Heading
        title="Revision services"
        subtitle="Set many revision for your service"
        />
        <Input
          id="revisions"
          label="Revision"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    )
  }
  const bodyContent = stepContent[step];
  
    
    return (
      <Modal
      disabled={isLoading}
      isOpen={serviceModal.isOpen}
      title='Add Service'
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.TITLE ? undefined : onBack}
      onClose={serviceModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body= {bodyContent}/>
    )
}

export default AddServiceModal;