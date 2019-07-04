export default function(server) {
  server.loadFixtures();

  createEvents(server);
  createPerformances(server);
}

function createEvents(server) {
  server.createList('event', 4, {
    title: 'Blues Street House Band',
    leadIn: 'Classic Rock with',
  });

  server.createList('event', 3, {
    title: 'Lon Eldridge',
    leadIn: `Sounds from the 20's & 30's with`,
  });

  server.createList('event', 2, {
    title: 'Ben Honeycutt',
    leadIn: `Acoustic Evening with`,
  });

  server.create('event', {
    title: 'Backwater Still',
    leadIn: '',
  });

  server.createList('event', 3, 'pastEvent', {
    title: 'Across Five Aprils',
    leadIn: 'A night of metal with',
  });
}

function createPerformances(server) {
  server.create('performance', {
    title: 'Blues Street House Band - Give Me One Reason',
    link: 'https://www.youtube.com/watch?v=XMEDXOZL5Do',
  });

  server.create('performance', {
    title: 'Curtis Loew - Blues Street House Band 2.17.18',
    link: 'https://www.youtube.com/watch?v=BFw5yBbmzqY',
  });

  server.create('performance', {
    title: 'Do It Again - The Buckner Brothers',
    link: 'https://www.youtube.com/watch?v=frd_IdCGtj4',
  });

  server.create('performance', {
    title: 'Lon Eldridge - China Town',
    link: 'https://www.youtube.com/watch?v=yDYxlQHpjFE',
  });
}
