"use client";
import Input from "@/app/components/inputs/Input";
import Selector from "../../inputs/Selector";
import { Profile } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import useAllCollege from "@/app/hooks/useAllCollege";
import useAllCollegeMajor from "@/app/hooks/useAllCollegeMajor";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import useAllCollegeTitle from "@/app/hooks/useAllCollegeTitle";
import useAllSkill from "@/app/hooks/useAllSkill";
import useCountries from "@/app/hooks/useCountries";
import useAllLanguages from "@/app/hooks/useLanguages";
import useLanguagesLevel from "@/app/hooks/useLanguagesLevel";
import axios from "axios";
import Swal from "sweetalert2";
import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { AiOutlineClose, AiOutlinePrinter } from "react-icons/ai";
import DescriptionInput from "./component/DescriptionInput";
import CountryInput from "./component/CountryInput";
import LanguageInput from "./component/LanguageInput";
import SkillInput from "./component/SkillInput";
import EducationInput from "./component/EducationInput";

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

interface BioProps {
  currentProfile: Profile;
}
const BioComponent: React.FC<BioProps> = ({ currentProfile }) => {
  const [languageNewAdd, setLanguageAdd] = useState(false);
  const [descriptionEditNew, setDescriptionEdit] = useState(false);
  const [educationEditNew, setEducationEdit] = useState(false);
  const [skillEditNew, setSkillEdit] = useState(false);
  const [countryEditNew, setCountryEdit] = useState(false);
  const [choiceLanguage, setChoiceLanguage] = useState("");
  const [choiceLevel, setChoiceLevel] = useState("");
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
      description: "",
      skill: [] as string[],
      country: "",
      language: [] as string[],
      college_name: "",
      college_title: "",
      college_major: "",
    },
  });
  const { getAll } = useCountries();
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const { data: AllCollege = [] } = useAllCollege();
  const { data: AllCollegeTitle = [] } = useAllCollegeTitle();
  const { data: AllCollegeMajor = [] } = useAllCollegeMajor();
  const optionsCollegeTitle = AllCollegeTitle.map((college_title: any) => ({
    value: college_title.college_title,
    label: college_title.college_title,
  }));
  const optionsCollegeMajor = AllCollegeMajor.map((college_major: any) => ({
    value: college_major.college_major,
    label: college_major.college_major,
  }));
  const optionsColleges = AllCollege.map((college: any) => ({
    value: college.college_name,
    label: college.college_name,
  }));
  const { data: AllLanguages = [] } = useAllLanguages();
  const { data: AllSkill = [] } = useAllSkill();
  const optionsSkills = AllSkill.map((skill: any) => ({
    value: skill.skills_name,
    label: skill.skills_name,
  }));
  const optionsLanguages = AllLanguages.map((language: any) => ({
    value: language.languages_name,
    label: language.languages_name,
  }));
  const country = watch("country");
  const language = watch("language");
  const skill = watch("skill");
  const college_name = watch("college_name");
  const college_title = watch("college_title");
  const college_major = watch("college_major");
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
  const handleChange = (event: SelectChangeEvent<typeof skill>) => {
    const {
      target: { value },
    } = event;
    setCustomValue("skill", value);
  };
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
  useEffect(() => {
    setCustomValue("language", [choiceLanguage + " " + choiceLevel]);
  }, [choiceLanguage, choiceLevel]);
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const res = axios
      .patch("/api/editprofile", data)
      .then((res) => {
        if (res.data.statusCode === 200) {
          Swal.fire({
            icon: "success",
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          reset();
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
      });
  };
  const toggleAddLanguage = () => {
    setLanguageAdd(!languageNewAdd);
  };
  const toggleEditDescription = () => {
    setDescriptionEdit(!descriptionEditNew);
  };
  const toggleEditCountry = () => {
    setCountryEdit(!countryEditNew);
  };
  const toggleEditSkill = () => {
    setSkillEdit(!skillEditNew);
  };
  const toggleEditEducation = () => {
    setEducationEdit(!educationEditNew);
  };
  return (
    <div className="card bg-base-300 w-[785px]">
      <div className="card-body border-slate-900">
        <h1 className="card-title text-3xl">Bio</h1>
        <div className="divider"></div>

        <div className="flex flex-col">
          <DescriptionInput currentProfile={currentProfile}/>

          <CountryInput currentProfile={currentProfile}/>
          <LanguageInput currentProfile={currentProfile}/>
          <SkillInput currentProfile={currentProfile}/>
          <EducationInput currentProfile={currentProfile}/>
        </div>
      </div>
    </div>
  );
};

export default BioComponent;
