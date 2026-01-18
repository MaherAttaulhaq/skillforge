import CourseDetails from "./CourseDetails";

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;

  return (
    <CourseDetails params={awaitedParams} searchParams={awaitedSearchParams} />
  );
}
