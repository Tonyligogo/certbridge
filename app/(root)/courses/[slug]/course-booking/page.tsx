import { BookingWizard } from "@/app/features/booking/components/BookingWizard"
import { getCourseBySlug } from "@/lib/server/course";
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
      <p>Booking page</p>
      <BookingWizard course={course} isSignedIn={false}/>
    </div>
  )
}

export default page