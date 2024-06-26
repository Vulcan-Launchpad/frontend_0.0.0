"use client";
import React from "react";
import Header from "@/components/dashboard/header";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import dynamic from "next/dynamic";
import InputInfo from "@/components/dashboard/create/atoms/infoInput";
import useToastr from "@/hooks/useToastr";
import useActiveWeb3 from "@/hooks/useActiveWeb3";
import useAuth from "@/hooks/useAuth";
const Description = dynamic(() => import("@/components/dashboard/create/atoms/descriptionInput"), { ssr: false });
import { useRouter } from "next/navigation";
import { IMGBB_API_KEY } from "@/constants/config";

const acceptables = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/webp'
]


const Create = () => {

  const [fullName, setFullName] = React.useState<string>("");
  const [company, setCompany] = React.useState<string>("");
  const [website, setWebsite] = React.useState<string>("");
  const [twitter, setTwitter] = React.useState<string>("");
  const [linkedin, setLinkedin] = React.useState<string>("");
  const [facebook, setFacebook] = React.useState<string>("");
  const [instagram, setInstagram] = React.useState<string>("");
  const [farcaster, setFarcaster] = React.useState<string>("");
  const [lens, setLens] = React.useState<string>("");
  const [bio, setBio] = React.useState<string>("");
  const [preview, setPreview] = React.useState<string>("");
  const [avatar, setAvatar] = React.useState<File|undefined>(undefined);
  const [isInvalid, setIsInvalid] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { showToast } = useToastr ();

  const { address, chain, isConnected, chainId } = useActiveWeb3();
  const { signUp } = useAuth();
  const router = useRouter ();

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {

      if (!event.target.files) throw "no files";
      const file: File = event.target.files[0];
      if (!file) throw "Emptry file";
      if (!acceptables.includes(file.type)) throw "Invalid Image file.";
      if (file.size > 32*1024*1024) throw "Overflow maximum file size (32MB).";
      setAvatar (file);
      const reader = new window.FileReader()
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const _file: string = String(reader.result);
        setPreview(_file);
      }
    } catch (err) {
      showToast(String(err), "warning"); 
      setPreview ("");
    }
  }

  const removeAvatar = () => {
    setPreview ("");
  }

  const _submitRegister = async () => {

    if (isLoading) return;

    try {
      setIsLoading (true);

      let _avatar = "";
      if (avatar) {
        const formData = new FormData();
        formData.append("image", avatar);
        const { data: { url: _newAvatar } } = await fetch(
          `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, 
          {
            method: "POST",
            body: formData
          }
        ).then(res => res.json());
        _avatar = _newAvatar;
      }
      
      const data = { fullName, company, website, twitter, facebook, instagram, farcaster, lens, bio, linkedin, avatar: _avatar };
      await signUp (data);
      router.push("/profile");
    } catch (err) {
      
    } finally {
      setIsLoading (false);
    }
  }

  const handleSubmit = () => {

    if (isLoading) return;
    
    setIsInvalid (true);
    
    let valid = true;
    
    if (!fullName) {
      showToast ("Input your fullname", "warning");
      valid = false;
    }
    if (!company) {
      showToast ("Input your company name", "warning");
      valid = false;
    }

    if (!bio) {
      showToast ("Input your Bio", "warning");
      valid = false;
    }

    if (valid) {
      if (!isConnected) {
        showToast ("Connect your wallet!", "warning");
      } else {
        _submitRegister ();
      }
    }
  }

  return (
    <div className="flex w-full flex-col gap-2 text-[#141416] dark:text-[#FAFCFF]">
      <Header />
      <h1 className="text-lg px-1">Create Your Profile</h1>
      <div className="dark:bg-[#100E28] bg-white px-3 xs:px-6 py-6 rounded-xl">
        <div className="flex gap-3 items-center">
          <div className="bg-[#4285EC] w-3 h-6 rounded-sm"></div>
          <h3 className="dark:text-[#CCCCCC] text-[#1A1D1F]">
            Welcome to Vulcan Pad
          </h3>
        </div>
        <section className="mt-5 flex gap-3 items-center">
          {
            preview  ?
            <Image
              src={preview}
              width={70}
              height={70}
              alt=''
              className='rounded-full aspect-square bg-[#be6a6a6b]'
            /> : 
            <Icon icon="flowbite:user-solid" width={70} height={70} className="rounded-full bg-[#46455367] opacity-50"/>
          }
          
          <label htmlFor="avatar" className="bg-[#2B6EC8] cursor-pointer rounded-lg py-[10px] px-4 text-white text-xs hover:bg-[#2b35c8] font-bold flex gap-1">
            <Icon icon="ph:plus-bold" width={14}/>
            <span>Upload new avatar</span>
          </label>
          <input hidden id="avatar" type="file" onChange={onFileChange} />
          <button onClick={removeAvatar} className="bg-white text-black rounded-lg py-[10px] px-4 text-xs border-2 dark:border-none border-[#EFEFEF] hover:bg-gray-200 font-bold">Remove</button>
        </section>
        
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-5">
          <InputInfo
            title="Display Name"
            placeholder="*Enter your Display Name"
            value={fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFullName (e.target.value)
            }
            isInvalid={isInvalid}
            message="Input fullName"
          />
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-5">
          <InputInfo
            title="Company"
            placeholder="*Enter your Company name"
            value={company}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCompany (e.target.value)
            }
            isInvalid={isInvalid}
            message="Input your company name"
          />
          <InputInfo
            title="Instagram"
            placeholder="*Enter your Instagram"
            value={instagram}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInstagram (e.target.value)
            }
            isInvalid={false}
            message="Input Instagram link"
          />
        </section>
        
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-3">
          <InputInfo
            title="Website"
            placeholder="*Enter your Website link"
            value={website}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setWebsite (e.target.value)
            }
            isInvalid={false}
            message="Input your Website link"
          />
          <InputInfo
            title="Linkedin"
            placeholder="*Enter your soLinkedincial link"
            value={linkedin}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLinkedin (e.target.value)
            }
            isInvalid={false}
            message="Input Linkedin link"
          />
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-3">
          <InputInfo
            title="Twitter"
            placeholder="*Enter your Twitter link"
            value={twitter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTwitter (e.target.value)
            }
            isInvalid={false}
            message="Input your Twitter link"
          />
          <InputInfo
            title="Facebook"
            placeholder="*Enter your Facebook link"
            value={facebook}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFacebook (e.target.value)
            }
            isInvalid={false}
            message="Input your Facebook link"
          />
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-3">
          <InputInfo
            title="Farcaster"
            placeholder="*Enter your Farcaster link"
            value={farcaster}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFarcaster (e.target.value)
            }
            isInvalid={false}
            message="Input your Farcaster link"
          />
          <InputInfo
            title="Lens"
            placeholder="*Enter your Lens link"
            value={lens}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLens (e.target.value)
            }
            isInvalid={false}
            message="Input your lens link"
          />
        </section>

        <Description
          title="Bio"
          info="*what is your desciption of project"
          className="mt-5 bio"
          placeholder="*Enter Bio..."
          value={bio}
          onChange={(value: string) => setBio(value)}
          isInvalid={isInvalid}
          message="input your Bio"
        />

        <div>
          <button onClick={handleSubmit} className="bg-[#2B6EC8] flex gap-1 justify-center items-center rounded-lg py-2 px-4 text-white text-xs hover:bg-[#2b35c8] font-bold mt-3">
            { !isLoading ? <Icon icon="bx:cloud-upload" width={20} height={20}/> : <Icon icon="line-md:uploading-loop" width={20} height={20}/> }  CREATE
          </button>
        </div>
      </div>
       
    </div>
  );
};

export default Create;
