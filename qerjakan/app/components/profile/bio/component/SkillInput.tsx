"use client";

import React, { useState } from "react";
import { Profile } from "@prisma/client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/app/components/inputs/Input";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import axios from "axios";
import useAllSkill from "@/app/hooks/useAllSkill";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { AiOutlineClose } from "react-icons/ai";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface DescriptionProps {
  currentProfile: Profile | null;
}

const SkillInput: React.FC<DescriptionProps> = ({ currentProfile }) => {
  const [skillEditNew, setSkillEdit] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      skill: [] as string[],
    },
  });
  const { data: AllSkill = [] } = useAllSkill();
  const optionsSkills = AllSkill.map((skill: any) => ({
    value: skill.skills_name,
    label: skill.skills_name,
  }));
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const res = axios
      .patch("/api/editskill", data)
      .then((res) => {
        if (res.data.statusCode === 200) {
          Swal.fire({
            icon: "success",
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          reset();
          router.push(`/profiles/${currentProfile?.userId}`);
          setSkillEdit(false);
        } else if (res.data.statusCode === 401) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.data.message,
          });
          reset();
          router.push("/");
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.data.message,
          });
          reset();
          setSkillEdit(false);
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      })
      .finally(() => {
        setIsLoading(false);
        router.refresh();
      });
  };
  const handleDeleteSkill = async (deleteSkill: string) => {
    try {
      const res = await axios
        .post("/api/deleteSkill", { deleteSkill })
        .then((res) => {
          if (res.data.statusCode === 200) {
            router.refresh();
          } else if (res.data.statusCode === 401) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: res.data.message,
            });
            reset();
            router.push("/");
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: res.data.message,
            });
          }
        });
    } catch (error) {}
  };
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const skill = watch("skill");
  const handleChange = (event: SelectChangeEvent<typeof skill>) => {
    const {
      target: { value },
    } = event;
    setCustomValue("skill", value);
  };
  const toggleEditSkill = () => {
    setSkillEdit(!skillEditNew);
  };
  return (
    <>
      <div className="pb-4">
        <div className="flex justify-between">
          <h1 className=" font-semibold">Skill</h1>
          <div onClick={toggleEditSkill}>
            <h2 className="hover:bg-green-400 hover:rounded-md  text-xs border-black hover:text-white flex border rounded-md justify-between items-center cursor-pointer px-2 group">
              (+) Edit Skill
            </h2>
          </div>
        </div>
        {skillEditNew ? (
          <>
            <FormControl sx={{ m: 1, width: 700 }}>
              <InputLabel sx={{ width: 400 }} id="demo-multiple-chip-label">
                Skills
              </InputLabel>

              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={skill}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value: any) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {optionsSkills.map((name: any) => (
                  <MenuItem key={name.value} value={name.value}>
                    <Checkbox checked={skill.indexOf(name.value) > -1} />
                    <ListItemText primary={name.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="card-actions justify-end py-2">
              <button
                onClick={handleSubmit(onSubmit)}
                className="btn btn-sm btn-accent"
              >
                Update Skill
              </button>
            </div>
          </>
        ) : (
          <>
            {currentProfile?.skill.length === 0 ? (
              <div>No skill has been set</div>
            ) : (
              <div>
                {currentProfile?.skill.map((kadal: any) => (
                  <>
                    <Chip
                      key={kadal}
                      label={kadal}
                      onDelete={() => handleDeleteSkill(kadal)}
                      
                    />
                  </>
                ))}
              </div>
            )}
          </>
        )}

        <div className="flex flex-row w-full border gap-2 px-2"></div>
      </div>
    </>
  );
};

export default SkillInput;
