/* eslint-disable @next/next/no-img-element */
"use client";

import { CustomDialog } from "@/components/custom-dialog";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import OnboardingWizard from "./onboarding-wizard";

const CompleteProfileBanner = () => {
  return (
    <div className="bg-primary w-full overflow-hidden rounded-xl py-6 md:py-0 px-4 md:px-10 flex flex-col md:flex-row gap-12 md:gap-8">
      <div className="text-white flex-4 flex flex-col justify-center gap-8">
        <h1 className="text-2xl font-bold">Welcome to CertBridge Global! 👋</h1>
        <p className="max-w-lg md:text-lg">
          Thanks for creating your account. Take a minute to complete your
          profile so we can personalize your training experience.
        </p>
        <CustomDialog
          title=""
          description=""
          trigger={
            <Button size="lg" className="bg-white text-primary w-fit text-md">
              Complete Profile <MoveRight />{" "}
            </Button>
          }
          className="sm:max-w-sm md:max-w-5xl"
        >
          <OnboardingWizard userName="John Doe" />
        </CustomDialog>
      </div>
      <img src="/learner.png" alt="Learner" className="h-48 object-contain mx-auto md:h-68 md:flex-1" />
    </div>
  );
};

export default CompleteProfileBanner;
