import CourseDetails from "./CourseDetails";

interface params {
  slug?: string[];
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<params>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const awaitedParams = await params;

  
  const awaitedSearchParams = await searchParams;

  return (
    <CourseDetails
      params={awaitedParams}
      searchParams={awaitedSearchParams}
    />
  );
}
