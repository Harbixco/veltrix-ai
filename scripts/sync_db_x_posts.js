const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
  const headerLine = lines[0];
  // Simple regex parser for quoted CSV
  const rows = [];
  let i = 1;

  while (i < lines.length) {
    let rowText = lines[i];
    // If quote counts are odd, it means a multiline field
    while ((rowText.match(/"/g) || []).length % 2 !== 0 && i + 1 < lines.length) {
      i++;
      rowText += '\n' + lines[i];
    }
    
    // Parse fields
    const regex = /(?:^|,)(?:"((?:[^"]|"")*)"|([^,]*))/g;
    let match;
    const fields = [];
    while ((match = regex.exec(rowText)) !== null) {
      let val = match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2];
      fields.push(val);
    }
    if (fields.length >= 8) {
      rows.push({
        date: fields[0],
        time: fields[1],
        day: fields[2],
        postNumber: fields[3],
        category: fields[4],
        ctaType: fields[5],
        mediaSuggestion: fields[6],
        postText: fields[7]
      });
    }
    i++;
  }
  return rows;
}

async function main() {
  const csvPath = path.join(__dirname, '..', 'content', 'x_schedule_buffer_typefully.csv');
  const csvText = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCSV(csvText);

  console.log(`Parsed ${rows.length} rows from CSV.`);

  const organizationId = '6af6da8935b48c1e048e7a5a';
  const socialPageId = '6af8033978f3c833e6f4bf5c';

  let updatedCount = 0;
  let createdCount = 0;

  for (const row of rows) {
    const isMorning = row.time.includes('09:00');
    const timeStr = isMorning ? 'T08:00:00.000Z' : 'T18:00:00.000Z';
    const scheduledFor = new Date(`${row.date}${timeStr}`);

    // Check for existing post around this time (+/- 2 hours)
    const startRange = new Date(scheduledFor.getTime() - 2 * 3600000);
    const endRange = new Date(scheduledFor.getTime() + 2 * 3600000);

    const existing = await prisma.scheduledPost.findFirst({
      where: {
        socialPageId,
        scheduledFor: {
          gte: startRange,
          lte: endRange
        }
      }
    });

    if (existing) {
      await prisma.scheduledPost.update({
        where: { id: existing.id },
        data: {
          caption: row.postText.trim(),
          mediaUrls: [],
          status: 'SCHEDULED',
          scheduledFor,
          publishedAt: null,
          errorMessage: null
        }
      });
      updatedCount++;
    } else {
      await prisma.scheduledPost.create({
        data: {
          organizationId,
          socialPageId,
          caption: row.postText.trim(),
          mediaUrls: [],
          scheduledFor,
          status: 'SCHEDULED'
        }
      });
      createdCount++;
    }
  }

  console.log(`Finished sync! Updated: ${updatedCount}, Created: ${createdCount}, Total in Plan: ${rows.length}`);
}

main()
  .catch(err => console.error('Sync error:', err))
  .finally(() => prisma.$disconnect());
