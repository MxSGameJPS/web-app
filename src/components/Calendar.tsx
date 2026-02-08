"use client";
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { Client } from "@/services/api";

export default function Calendar({ events }: { events: any[] }) {
  return (
    <div className="calendar-section glass-card">
      <h2>📅 Cronograma de Contatos</h2>
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={ptBrLocale}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          validRange={{
            start: "2020-01-01",
            end: "2030-01-01",
          }}
          height="auto"
        />
      </div>
    </div>
  );
}
