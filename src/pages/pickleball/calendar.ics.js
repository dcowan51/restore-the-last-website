import { icsFile } from '../../data/pickleballEvent.js';

// Apple Calendar / Outlook download for the Ugly Sweater Slam, built at deploy time.
export function GET() {
  return new Response(icsFile, {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
}
