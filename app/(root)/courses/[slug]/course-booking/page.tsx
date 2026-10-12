import { BookingWizard } from "@/app/features/booking/components/BookingWizard"
import { getCourseBySlug } from "@/lib/server/course";
import { Clock } from "lucide-react";
import Link from "next/link";

const page = async ({
  params,
}: { params: { slug: string } }) => {
  const { slug } = await params;

  const course = await getCourseBySlug(slug);
  if (!course){
     return <div className="flex flex-col gap-3 text-center justify-center py-16">
    <p>It appears the course you are trying to book does not exist!</p>
    <p>Please go back <Link href="/courses" className="text-blue-500">here</Link> and confirm you are selecting the right course</p>
  </div>
  }
  return (
    <div>
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-350 px-4 pt-12 pb-16 lg:px-10">
          <span className="text-sm font-semibold uppercase tracking-wider text-white">
            YOU&apos;Re REQUESTING :
          </span>
          <h1 className="my-3 text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight max-w-3xl">
            {course.title}
          </h1>
          {/* <p className="my-5 text-lg text-white/90 max-w-2xl leading-relaxed">
            {course.shortDescription}
          </p> */}
            <span className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold border border-white/15 inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {course.durationDays} day
              {course.durationDays > 1 ? "s training" : " training"}
            </span>
        </div>
      </section>
      <div className="p-4 max-w-7xl mx-auto py-16">
      <BookingWizard course={course} isSignedIn={false}/>
      </div>
    </div>
  )
}

export default page