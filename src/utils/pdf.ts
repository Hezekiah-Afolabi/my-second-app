import type { ReadingListEntry } from '../types';

export function exportReadingListAsPDF(list: ReadingListEntry[]) {
  const wantToRead = list.filter(e => e.status === 'want-to-read');
  const reading = list.filter(e => e.status === 'reading');
  const finished = list.filter(e => e.status === 'finished');

  const formatDate = (iso?: string) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderSection = (title: string, entries: ReadingListEntry[]) => {
    if (entries.length === 0) return '';
    const rows = entries
      .map(
        e => `
        <tr>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;">
            <strong>${e.bookTitle}</strong><br/>
            <span style="color:#666;font-size:13px;">${e.bookAuthor}</span>
          </td>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;font-size:13px;color:#444;">${formatDate(e.addedDate)}</td>
          ${e.status === 'finished' ? `<td style="padding:10px 8px;border-bottom:1px solid #eee;font-size:13px;color:#444;">${formatDate(e.finishedDate)}</td>` : ''}
        </tr>`
      )
      .join('');

    return `
      <h3 style="color:#25D366;margin:24px 0 8px;font-size:16px;">${title} (${entries.length})</h3>
      <table style="width:100%;border-collapse:collapse;font-family:sans-serif;">
        <thead>
          <tr style="background:#f5f5f5;">
            <th style="padding:8px;text-align:left;font-size:13px;">Book</th>
            <th style="padding:8px;text-align:left;font-size:13px;">Added</th>
            ${title === 'Finished' ? '<th style="padding:8px;text-align:left;font-size:13px;">Finished</th>' : ''}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <title>My ReadRight Reading List</title>
      <style>
        body { font-family: Georgia, serif; color: #2d2926; max-width: 700px; margin: 0 auto; padding: 32px; }
        h1 { color: #25D366; border-bottom: 2px solid #25D366; padding-bottom: 12px; }
        p { color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <h1>My ReadRight Reading List</h1>
      <p>Exported on ${formatDate(new Date().toISOString())} &bull; ${list.length} book${list.length !== 1 ? 's' : ''} total</p>
      ${renderSection('Want to Read', wantToRead)}
      ${renderSection('Currently Reading', reading)}
      ${renderSection('Finished', finished)}
    </body>
    </html>
  `;

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
  win.close();
}
