import { Card, CardHeader } from "@/components/ui/card";
import { useGetAllSchedule } from "@/http/schedule/get-all-schedule";
import FullCalendar from "@fullcalendar/react";
import { useSession } from "next-auth/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, EventApi } from "@fullcalendar/core";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function ScheduleCalendar() {
  const session = useSession();
  const { data, isPending } = useGetAllSchedule(
    session.data?.access_token as string,
    {
      enabled: session.status === "authenticated",
    }
  );

  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);

  if (isPending) {
    return <div>loading...</div>;
  }

  const events =
    data?.data?.map((event) => ({
      id: event.id.toString(),
      title: event.nama_matakuliah,
      start: event.start,
      end: event.end,
      extendedProps: {
        dosen: event.dosen_pengampu,
        ruang: event.ruang_kelas,
        sks: event.sks,
      },
    })) || [];

  const renderEventContent = (eventInfo: any) => {
    return (
      <div>
        <div>{eventInfo.timeText}</div>
        <strong>{eventInfo.event.title}</strong>
      </div>
    );
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent(clickInfo.event);
  };

  return (
    <div className="my-6">
      <Card>
        <CardHeader>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek,dayGridDay",
            }}
            eventClassNames="bg-primary text-white cursor-pointer"
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            height="100%"
            contentHeight="auto"
          />
        </CardHeader>
      </Card>

      {selectedEvent && (
        <Dialog
          open={selectedEvent !== null}
          onOpenChange={() => setSelectedEvent(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Jam Kuliah:</span>{" "}
                {format(
                  selectedEvent.start || "Tanggal tidak tersedia",
                  "EEEE d MMMM yyyy, HH:mm:ss",
                  { locale: id }
                )}{" "}
              </p>
              <p>
                <span className="font-semibold">Dosen:</span>{" "}
                {selectedEvent.extendedProps.dosen}
              </p>
              <p>
                <span className="font-semibold">Ruang:</span>{" "}
                {selectedEvent.extendedProps.ruang}
              </p>
              <p>
                <span className="font-semibold">Jumlah SKS:</span>{" "}
                {selectedEvent.extendedProps.sks}
              </p>
            </div>
            <DialogFooter>
              <Button>
                <Link href={`/dashboard/schedule/${selectedEvent.id}`}>
                  Detail Kelas
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
