"use client";

import React, { useEffect, useState } from "react";
import { Profile } from "@prisma/client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/app/components/inputs/Input";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";
import useAllLanguages from "@/app/hooks/useLanguages";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";

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
  currentProfile: Profile;
}

const LanguageInput: React.FC<DescriptionProps> = ({ currentProfile }) => {
  const [languageNewAdd, setLanguageAdd] = useState(false);
  const [choiceLanguage, setChoiceLanguage] = useState("");
  const [choiceLevel, setChoiceLevel] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const language_levels = [
    {
      value: "Basic",
    },
    {
      value: "Conventional",
    },
    {
      value: "Fluent",
    },
    {
      value: "Native",
    },
  ];
  const mappedLanguage = language_levels.map((language: any) => ({
    value: language.value,
    label: language.value,
  }));
  const handleChangeLanguage = (
    event: SelectChangeEvent<typeof choiceLanguage>
  ) => {
    const {
      target: { value },
    } = event;
    setChoiceLanguage(value);
  };
  const handleChangeLanguageLevel = (
    event: SelectChangeEvent<typeof choiceLevel>
  ) => {
    const {
      target: { value },
    } = event;
    setChoiceLevel(value);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      language: [] as string[],
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const res = axios
      .patch("/api/editlanguages", data)
      .then((res) => {
        if (res.data.statusCode === 200) {
          Swal.fire({
            icon: "success",
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          setLanguageAdd(false);
          setChoiceLanguage("");
          setChoiceLevel("");
          reset();
          window.location.reload()
          
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
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const toggleAddLanguage = () => {
    setLanguageAdd(!languageNewAdd);
  };
  const splitArrayOfStrings = (arrayToSplit: string[]): string[][] => {
    return arrayToSplit.map(item => [item.split(' ')[0]]);
  };
  
  const splitCurrLanguage = splitArrayOfStrings(currentProfile?.language)
  useEffect(() => {
    setCustomValue("language", [choiceLanguage + " " + choiceLevel]);
  }, [choiceLanguage, choiceLevel]);
  const mapArrayExcludingProfileValues = (profileArray: string[][], arrayToMap: string[]): string[] => {
    return arrayToMap.filter(item => {
      for (const profile of profileArray) {
        if (profile.includes(item)) {
          return false;
        }
      }
      return true;
    });
  };
  
  const ListLanguage = ["English","Japanese", "Indonesia", "Romanian", "Russian", "Tagalog", "Sundanese", "Turkish", "Italian"]
  const mappedArray = mapArrayExcludingProfileValues(splitCurrLanguage, ListLanguage)
  const handleDeleteLanguage = async (deleteLanguage: string) => {
    try {
      const res = await axios
        .post("/api/deleteLanguage", { deleteLanguage })
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
  return (
    <>
      <div className="pb-4">
        <div className="flex justify-between">
          <h1 className=" font-semibold">Language</h1>
          {currentProfile?.language.length !== 3 && (
            <div onClick={toggleAddLanguage}>
              <h2 className="hover:bg-green-400 hover:rounded-md  text-xs border-black hover:text-white flex border rounded-md justify-between items-center cursor-pointer px-2 group">
                (+) Add Language
              </h2>
              
            </div>
          )}
        </div>
        {languageNewAdd ? (
          <>
          <div className="gap-2">
                {currentProfile?.language.map((kadal: any) => (
                  <>
                    {/* <p>{kadal}</p> */}
                    <Chip
                      key={kadal}
                      label={kadal}
                      onDelete={() => handleDeleteLanguage(kadal)}
                    />
                  </>
                ))}
              </div>
            <FormControl sx={{ m: 1, width: 700 }}>
              <InputLabel sx={{ width: 400 }} id="demo-multiple-chip-label">
                Language
              </InputLabel>

              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                value={choiceLanguage}
                onChange={handleChangeLanguage}
                input={<OutlinedInput id="select-multiple-chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    <Chip key={selected} label={selected} />
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {mappedArray.map((name: any) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {choiceLanguage !== "" && (
              <>
              
                <FormControl sx={{ m: 1, width: 700 }}>
                  <InputLabel sx={{ width: 400 }} id="demo-multiple-chip-label">
                    Language Level
                  </InputLabel>

                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    value={choiceLevel}
                    onChange={handleChangeLanguageLevel}
                    input={<OutlinedInput id="select-multiple-chip" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        <Chip key={selected} label={selected} />
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {mappedLanguage.map((name: any) => (
                      <MenuItem key={name.value} value={name.value}>
                       {name.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <div className="card-actions justify-end py-2">
                  <button
                    onClick={handleSubmit(onSubmit)}
                    className="btn btn-sm btn-accent"
                  >
                    Update Language
                  </button>
                </div>
              </>
            )}
            
          </>
        ) : (
          <>
            {currentProfile?.language.length === 0 ? (
              <div>No language has been set</div>
            ) : (
              <div className="gap-2">
                {currentProfile?.language.map((kadal: any) => (
                  <>
                    {/* <p>{kadal}</p> */}
                    <Chip
                      key={kadal}
                      label={kadal}
                      onDelete={() => handleDeleteLanguage(kadal)}
                    />
                  </>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default LanguageInput;
