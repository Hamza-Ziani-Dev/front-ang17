import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent {
  selectedCategories: { [key: string]: boolean } = {
    eventAgenda: true,
    birthdayAgenda: true,
    reminderAgenda: true
  };

  allEvents = [

    { title: 'Rappel pour la soumission de projet', start: '2025-04-22T10:30:00', category: 'eventAgenda', color: '#42acde' },

    { title: 'Réunion avec le directeur général', start: '2025-04-22T12:00:00', category: 'eventAgenda', color: '#ff4436' },
    { title: 'Réunion avec Mohamed', start: '2025-04-22T5:00:00', category: 'eventAgenda', color: '#4caf50' },

    { title: 'Réunion avec l’équipe de développement', start: '2025-04-23T09:00:00', category: 'eventAgenda', color: '#76de5a' },
    { title: 'Réunion avec HR', start: '2025-04-23T13:00:00', category: 'eventAgenda', color: '#e7b885' },
    { title: 'Anniversaire de Said', start: '2025-04-23T20:00:00', category: 'birthdayAgenda', color: '#ff9800' },

    { title: 'Rappel de réunion', start: '2025-04-24T16:00:00', category: 'reminderAgenda', color: '#31c0e8' },
    { title: 'Réunion stratégique avec l’équipe marketing', start: '2025-04-24T17:00:00', category: 'eventAgenda', color: '#2196f3' },

    { title: 'Entretien annuel avec le client', start: '2025-04-25T9:00:00', category: 'eventAgenda', color: '#ead486' },
    { title: 'Formation sur le leadership', start: '2025-04-25T9:30:00', category: 'eventAgenda', color: '#73b8f1' },
    { title: 'Rappel de réunion', start: '2025-04-25T14:00:00', category: 'eventAgenda', color: '#5abced' },

    { title: 'Célébration de l’anniversaire de la société', start: '2025-04-26T11:00:00', category: 'eventAgenda', color: '#3eb7d5' },
    { title: 'Sport', start: '2025-04-27T11:00:00', category: 'eventAgenda', color: '#3cd4da' },


  ];

  filteredEvents = this.allEvents;

  calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    // initialView: 'timeGridWeek',
    initialView: 'dayGridMonth', // make sure month view is used
    // height: 'auto',              // key: auto height based on content
    // contentHeight: 'auto',
    // expandRows: true,
    // handleWindowResize: true,
    slotMinTime: '08:00:00',
    // slotMaxTime: '20:00:00',
    allDaySlot: false,
    height: 'auto',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: this.filteredEvents,
    dayCellDidMount: (info) => {
        // Find events for that day
        const dateStr = info.date.toISOString().split('T')[0];
        const eventsForDay = this.filteredEvents.filter(e => e.start.startsWith(dateStr));

        // Apply color only if there’s an event
        if (eventsForDay.length > 0) {
          // Optional: if multiple, pick the first or calculate a blend
          const eventColor = eventsForDay[0].color;

          // Apply background color
          info.el.style.backgroundColor = eventColor;
        //   info.el.style.opacity = '0.30'; // Optional for softer look
        }
      },
    eventClick: (info) => {
      if (info.event.url) {
        window.open(info.event.url, '_blank');
        info.jsEvent.preventDefault();
      }
    },
    editable: true,
    selectable: true,
    eventDidMount: (info) => {
        const tooltip = document.createElement('div');
        tooltip.innerText = info.event.title;
        tooltip.className =
          'absolute z-50 bg-gray-900 text-white text-xs rounded py-1 px-2 shadow-lg opacity-0 transition-opacity duration-200 pointer-events-none';
        tooltip.style.top = '-30px';
        tooltip.style.left = '0';

        info.el.style.position = 'relative';
        info.el.appendChild(tooltip);

        info.el.addEventListener('mouseenter', () => {
          tooltip.classList.remove('opacity-0');
          tooltip.classList.add('opacity-100');
        });

        info.el.addEventListener('mouseleave', () => {
          tooltip.classList.remove('opacity-100');
          tooltip.classList.add('opacity-0');
        });
      }
  };

  filterEvents(category: string, event: any) {
    this.selectedCategories[category] = event.target.checked;

    this.filteredEvents = this.allEvents.filter(event =>
      this.selectedCategories[event.category]
    );

    this.calendarOptions.events = this.filteredEvents;
    this.updateCalendar();
  }

  updateCalendar() {
    this.calendarOptions.events = this.filteredEvents;
  }
}
