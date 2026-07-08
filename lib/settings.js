const { prisma } = require('./db');

async function getSettings() {
  return prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' },
  });
}

module.exports = { getSettings };
