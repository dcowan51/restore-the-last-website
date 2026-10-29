// The Ugly Sweater Slam (Dec 5, 2026). Shared by the event page (/pickleball), its
// add-to-calendar links, and the homepage banner, so a change lands everywhere.
// TODO before launch: confirm the court booking/address with Anthem Community Council.
export const event = {
  name: 'Ugly Sweater Slam',
  date: 'Saturday, December 5, 2026',
  time: '1:00 PM',
  venue: 'Anthem Pickleball Courts',
  address: 'Anthem Community Center, 41130 N Freedom Way, Anthem, AZ 85086',
  mapUrl: 'https://maps.google.com/?q=41130+N+Freedom+Way,+Anthem,+AZ+85086',
  // Arizona has no daylight saving, so it's UTC-7 all year. The end time is an
  // estimate for calendars; change it once the schedule is set.
  start: '2026-12-05T13:00:00-07:00',
  end: '2026-12-05T16:00:00-07:00',
  url: 'https://restorethelast.org/pickleball',
};

// Calendar timestamps in UTC, the form both Google Calendar and .ics files take.
const utc = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

const details = `Christmas pickleball fundraiser for Restore the Last. Wear your ugliest sweater. Details: ${event.url}`;

export const googleCalendarUrl =
  'https://calendar.google.com/calendar/render?' +
  new URLSearchParams({
    action: 'TEMPLATE',
    text: `${event.name} — Restore the Last`,
    dates: `${utc(event.start)}/${utc(event.end)}`,
    details,
    location: event.address,
  });

// Escaping per RFC 5545: backslash, comma, and semicolon in text values.
const ics = (s) => s.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\;');

export const icsFile = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Restore the Last//Ugly Sweater Slam//EN',
  'BEGIN:VEVENT',
  'UID:ugly-sweater-slam-2026@restorethelast.org',
  `DTSTAMP:${utc('2026-10-29T00:00:00Z')}`,
  `DTSTART:${utc(event.start)}`,
  `DTEND:${utc(event.end)}`,
  `SUMMARY:${ics(`${event.name} — Restore the Last`)}`,
  `LOCATION:${ics(event.address)}`,
  `DESCRIPTION:${ics(details)}`,
  `URL:${event.url}`,
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n');
