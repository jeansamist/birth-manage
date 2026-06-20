"use client"

import { AnimatePresence, motion } from "framer-motion"
import { StepBaby } from "./step-baby"
import { StepMother } from "./step-mother"
import { StepFather } from "./step-father"
import { StepReview } from "./step-review"
import { slideVariants } from "./form-config"
import type { UseFormReturn } from "react-hook-form"
import type { BirthFormInput } from "@/lib/schemas/birth"

interface StepContainerProps {
  step: number
  direction: number
  form: UseFormReturn<BirthFormInput>
  cityHalls: any[]
  serverError: string | null
  fatherUnknown: boolean
  setFatherUnknown: (val: boolean) => void
  setStep: (s: number | ((prev: number) => number)) => void
  setDirection: (d: number) => void
}

export function StepContainer({
  step,
  direction,
  form,
  cityHalls,
  serverError,
  fatherUnknown,
  setFatherUnknown,
  setStep,
  setDirection,
}: StepContainerProps) {
  return (
    <div className="flex-1 p-8 md:p-12">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.18, ease: "easeInOut" }}
        >
          {step === 0 && <StepBaby form={form} />}
          {step === 1 && <StepMother form={form} />}
          {step === 2 && (
            <StepFather
              form={form}
              fatherUnknown={fatherUnknown}
              onToggle={(val) => {
                setFatherUnknown(val)
                if (val) {
                  setDirection(1)
                  setStep(3)
                }
              }}
            />
          )}
          {step === 3 && (
            <StepReview
              form={form}
              cityHalls={cityHalls}
              serverError={serverError}
              fatherUnknown={fatherUnknown}
              onEditStep={(s) => {
                setDirection(-1)
                setStep(s)
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
