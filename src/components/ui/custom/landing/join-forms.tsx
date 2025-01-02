"use client"

import { LearnerForm } from "@/components/ui/custom/form/learner-form"
import { Card } from "@/components/ui/card"

export function JoinForms() {
  return (
    <section className="container space-y-6 py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Únete a la Investigación
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Forma parte de nuestra comunidad de aprendices y contribuye al desarrollo de la IA
        </p>
      </div>

      <div className="mx-auto w-full max-w-[58rem]">
        <Card>
          <LearnerForm />
        </Card>
      </div>
    </section>
  )
} 