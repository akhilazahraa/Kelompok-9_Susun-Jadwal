import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetAllAssignment } from "@/http/assignment/get-all-assignment";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ClipboardCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AssignmentList() {
  const session = useSession();
  const { data } = useGetAllAssignment(session.data?.access_token as string, {
    enabled: session.status === "authenticated",
  });
  return (
    <>
      <div className="my-8 grid md:grid-cols-3 grid-cols-1">
        {data?.data.map((assignment) => (
          <Link href={`assignments/${assignment.id}`}>
            <Card
              className="w-full border-2 border-muted shadow-transparent group-hover:bg-muted hover:underline hover:text-primary"
              key={assignment.id}
            >
              <CardHeader className="p-0 flex md:flex-row md:items-center md:justify-between">
                <div className="relative hidden aspect-video w-full h-full items-center justify-center rounded-t-xl bg-primary group-hover:bg-secondary md:flex">
                  <ClipboardCheck className="m-auto h-12 w-12 text-white" />
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                <h1 className="font-bold">{assignment.title}</h1>
                <p className="text-muted-foreground text-sm">
                  Deadline{" "}
                  <span className="text-red-600">
                    {format(assignment.end, "EEEE d MMMM yyyy, HH:mm:ss", {
                      locale: id,
                    })}
                  </span>
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
