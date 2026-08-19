import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  LockClosedIcon,
  ShieldCheckIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";

// Local Imports
import { Button, Input } from "components/ui";
// import { changePassword } from "api/login/login";

export default function General() {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const schema = Yup.object().shape({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string().required("New password is required").min(8),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("newPassword")], "Passwords must match"),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const handleAddSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      // const res = await changePassword({
      //   password: data.oldPassword,
      //   newPassword: data.newPassword,
      //   confirmPassword: data.confirmPassword,
      // });
      // if (res.code === 200) {
      //   toast.success(res.message);
      //   reset();
      // } else {
      //   toast.error(res.message);
      // }
    } catch (err) {
      toast.error("Error changing password");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-4xl mx-auto p-6 lg:p-10"
    >
      {/* HEADER SECTION - No Box, just clean text */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-[#1B2559] rounded-2xl shadow-lg shadow-blue-900/20">
          <ShieldCheckIcon className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#1B2559] tracking-tight">Security Settings</h1>
          <p className="text-gray-400 text-sm font-medium">Manage your account security and authentication</p>
        </div>
      </div>

      {/* MAIN CONTENT AREA - Single clean card without nested boxes */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        
        {/* SECTION TITLE */}
        <div className="px-8 pt-10 pb-6 border-b border-gray-50 flex items-center gap-3">
          <KeyIcon className="h-5 w-5 text-[#E73335]" />
          <h2 className="text-sm font-black text-[#1B2559] uppercase tracking-[0.2em]">Update Password</h2>
        </div>

        <form onSubmit={handleSubmit(handleAddSubmit)} className="p-8 lg:p-10 space-y-10">
          
          {/* CURRENT PASSWORD - Full Width */}
          <div className="max-w-2xl">
            <Input
              label="Current Password"
              placeholder="Enter your current password"
              type={showOldPassword ? "text" : "password"}
              className="h-14 bg-gray-50/50 border-gray-200 focus:bg-white rounded-2xl transition-all"
              prefix={<LockClosedIcon className="size-5 text-gray-400" />}
              suffix={
                <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="text-gray-400 px-2">
                  {showOldPassword ? <EyeSlashIcon className="size-5" /> : <EyeIcon className="size-5" />}
                </button>
              }
              {...register("oldPassword")}
              error={errors?.oldPassword?.message}
            />
          </div>

          {/* NEW PASSWORDS - Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              label="New Password"
              placeholder="Min. 8 characters"
              type={showNewPassword ? "text" : "password"}
              className="h-14 bg-gray-50/50 border-gray-200 focus:bg-white rounded-2xl transition-all"
              prefix={<LockClosedIcon className="size-5 text-gray-400" />}
              suffix={
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="text-gray-400 px-2">
                  {showNewPassword ? <EyeSlashIcon className="size-5" /> : <EyeIcon className="size-5" />}
                </button>
              }
              {...register("newPassword")}
              error={errors?.newPassword?.message}
            />

            <Input
              label="Confirm New Password"
              placeholder="Repeat new password"
              type={showConfirmPassword ? "text" : "password"}
              className="h-14 bg-gray-50/50 border-gray-200 focus:bg-white rounded-2xl transition-all"
              prefix={<LockClosedIcon className="size-5 text-gray-400" />}
              suffix={
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 px-2">
                  {showConfirmPassword ? <EyeSlashIcon className="size-5" /> : <EyeIcon className="size-5" />}
                </button>
              }
              {...register("confirmPassword")}
              error={errors?.confirmPassword?.message}
            />
          </div>

          {/* ACTION BUTTONS - Clean alignment */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <Button
              onClick={() => navigate(-1)}
              type="button"
              variant="outlined"
              className="h-12 px-8 rounded-xl font-bold border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={submitLoading}
              className="h-12 px-10 rounded-xl font-bold bg-[#1B2559] hover:bg-[#151c42] text-white shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
            >
             Save
            </Button>
          </div>
        </form>
      </div>

      {/* INFO FOOTER */}
      {/* <div className="mt-10 flex items-center justify-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
        <ShieldCheckIcon className="h-4 w-4" />
        End-to-End Encrypted Security
      </div> */}
    </motion.div>
  );
}