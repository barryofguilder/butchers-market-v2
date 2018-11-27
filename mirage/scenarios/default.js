export default function(server) {

  server.loadFixtures();

  createEvents(server);
  createPerformances(server);
  createStoreHours(server);

}

function createEvents(server) {
  server.createList('event', 4, {
    title: 'Blues Street House Band',
    leadIn: 'Classic Rock with'
  });

  server.createList('event', 3, {
    title: 'Lon Eldridge',
    leadIn: `Sounds from the 20's & 30's with`
  });

  server.createList('event', 2, {
    title: 'Ben Honeycutt',
    leadIn: `Acoustic Evening with`
  });

  server.create('event', {
    title: 'Backwater Still',
    leadIn: ''
  })
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

function createStoreHours(server) {
  server.create('hour', {
    type: 'Cafe',
    label: 'Cafe Hours (normal)',
    active: true,
    line1: 'Mon - Thurs: 9:00am - 5:30pm',
    line2: 'Fri & Sat: 9:00am - 10:00pm, last call 9:30pm',
    line3: 'Sun: Closed'
  });

  server.create('hour', {
    type: 'Cafe',
    label: 'Cafe Hours (Thanksgiving)',
    active: false,
    line1: 'Thanksgiving Week: Closed Thurs - Sat',
    line2: 'Will continue regular hours Monday Nov. 26'
  });

  server.create('hour', {
    type: 'Store',
    label: 'Store Hours (normal)',
    active: true,
    line1: 'Mon - Sat: 9:00am - 6:00pm',
    line2: 'Sun: Closed'
  });

  server.create('hour', {
    type: 'Store',
    label: 'Store Hours (Thanksgiving)',
    active: false,
    line1: 'Thanksgiving Week: Closed Thurs - Sat',
    line2: 'Will continue regular hours Monday Nov. 26'
  });
}
