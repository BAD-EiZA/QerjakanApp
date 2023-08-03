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
import Heading from '../Heading';
import Swal from 'sweetalert2';
import Selector from '../inputs/Selector';
import useSkillModal from '@/app/hooks/useSkillModal';
import useAllSkill from '@/app/hooks/useAllSkill';

const SkillModal = () => {
    const router = useRouter();
    const skillModal = useSkillModal()
    const {data:AllSkill = []} = useAllSkill()
    const optionsSkills = AllSkill.map((skill: any) => ({
        value: skill.skills_name,
        label: skill.skills_name,
      }));
    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true
        })
    }
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
            skill: ''
        }
    });
    const skill = watch('skill');

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.patch('/api/editskill', data)
        .then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Update Skill Profile Success',
            showConfirmButton: false,
            timer: 1500
        })
        reset();
        router.refresh();
        skillModal.onClose();
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
                title="Skill profiles"
                subtitle="Update your skill profiles"
            />
           <Selector 
           register={register} errors={errors}
           idSelector='skill'
                value={skill}
                onChange={(value) => setCustomValue('skill', value)}
                fillOptions={optionsSkills}
                placeHolder='Skill' 
            />
        </div>
    )

    return (
        <Modal
        disabled={isLoading}
        isOpen={skillModal.isOpen}
        title='Update Profiles'
        actionLabel='Update'
        onClose={skillModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body= {bodyContent}
        />
    )
}

export default SkillModal