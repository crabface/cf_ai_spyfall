/**
 * Spyfall game locations
 * Each location represents a place where the game takes place
 */

export const LOCATIONS = [
  { name: 'Airplane', roles: ['Passenger', 'Flight Attendant', 'Pilot', 'Air Marshal', 'Economy Passenger', 'First Class Passenger'] },
  { name: 'Bank', roles: ['Customer', 'Teller', 'Manager', 'Security Guard', 'Robber', 'Consultant'] },
  { name: 'Beach', roles: ['Sunbather', 'Lifeguard', 'Surfer', 'Ice Cream Vendor', 'Beach Volleyball Player', 'Tourist'] },
  { name: 'Casino', roles: ['Gambler', 'Dealer', 'Bartender', 'Security Guard', 'Manager', 'Hustler'] },
  { name: 'Cathedral', roles: ['Priest', 'Visitor', 'Sinner', 'Beggar', 'Tourist', 'Choir Singer'] },
  { name: 'Circus', roles: ['Acrobat', 'Animal Trainer', 'Clown', 'Magician', 'Fire Eater', 'Visitor'] },
  { name: 'Corporate Party', roles: ['Employee', 'Manager', 'Party Entertainer', 'Caterer', 'Intern', 'Accountant'] },
  { name: 'Crusader Army', roles: ['Monk', 'Knight', 'Squire', 'Archer', 'Servant', 'Bishop'] },
  { name: 'Day Spa', roles: ['Customer', 'Masseuse', 'Manicurist', 'Beautician', 'Dermatologist', 'Stylist'] },
  { name: 'Embassy', roles: ['Ambassador', 'Security Guard', 'Secretary', 'Refugee', 'Diplomat', 'Government Official'] },
  { name: 'Hospital', roles: ['Nurse', 'Doctor', 'Patient', 'Surgeon', 'Anesthesiologist', 'Intern'] },
  { name: 'Hotel', roles: ['Guest', 'Receptionist', 'Bellhop', 'Manager', 'Housekeeper', 'Security Guard'] },
  { name: 'Military Base', roles: ['Soldier', 'Colonel', 'Medic', 'Deserter', 'Officer', 'Tank Engineer'] },
  { name: 'Movie Studio', roles: ['Actor', 'Director', 'Camera Operator', 'Stunt Double', 'Producer', 'Costume Artist'] },
  { name: 'Ocean Liner', roles: ['Captain', 'Passenger', 'Bartender', 'Cook', 'Musician', 'Waiter'] },
  { name: 'Passenger Train', roles: ['Passenger', 'Conductor', 'Mechanic', 'Restaurant Chef', 'Engineer', 'Stoker'] },
  { name: 'Pirate Ship', roles: ['Captain', 'Sailor', 'Cook', 'Slave', 'Cannoneer', 'Prisoner'] },
  { name: 'Polar Station', roles: ['Medic', 'Geologist', 'Expedition Leader', 'Biologist', 'Radioman', 'Hydrologist'] },
  { name: 'Police Station', roles: ['Detective', 'Officer', 'Criminal', 'Lawyer', 'Journalist', 'Criminalist'] },
  { name: 'Restaurant', roles: ['Chef', 'Waiter', 'Customer', 'Critic', 'Host', 'Dishwasher'] },
  { name: 'School', roles: ['Teacher', 'Student', 'Principal', 'Security Guard', 'Janitor', 'Lunch Lady'] },
  { name: 'Service Station', roles: ['Customer', 'Mechanic', 'Tire Specialist', 'Manager', 'Car Washer', 'Electrician'] },
  { name: 'Space Station', roles: ['Engineer', 'Astronaut', 'Commander', 'Scientist', 'Doctor', 'Space Tourist'] },
  { name: 'Submarine', roles: ['Captain', 'Sailor', 'Sonar Technician', 'Cook', 'Navigator', 'Radioman'] },
  { name: 'Supermarket', roles: ['Customer', 'Cashier', 'Manager', 'Stock Clerk', 'Security Guard', 'Janitor'] },
  { name: 'Theater', roles: ['Actor', 'Director', 'Prompter', 'Stagehand', 'Coat Check', 'Viewer'] },
  { name: 'University', roles: ['Professor', 'Student', 'Dean', 'Janitor', 'Researcher', 'Librarian'] },
  { name: 'Art Museum', roles: ['Visitor', 'Tour Guide', 'Security Guard', 'Curator', 'Artist', 'Art Critic'] },
  { name: 'Zoo', roles: ['Visitor', 'Zookeeper', 'Veterinarian', 'Tour Guide', 'Photographer', 'Concession Worker'] },
  { name: 'Library', roles: ['Student', 'Librarian', 'IT Support', 'Researcher', 'Janitor', 'Book Club Member'] },
  { name: 'Amusement Park', roles: ['Visitor', 'Ride Operator', 'Park Manager', 'Food Vendor', 'Mascot', 'Ticket Seller'] },
  { name: 'Gym', roles: ['Member', 'Personal Trainer', 'Receptionist', 'Yoga Instructor', 'Maintenance', 'Nutritionist'] },
  { name: 'Rock Concert', roles: ['Fan', 'Musician', 'Roadie', 'Security Guard', 'Sound Engineer', 'Merchandise Seller'] },
  { name: 'Jazz Club', roles: ['Musician', 'Bartender', 'Patron', 'Waiter', 'Manager', 'Singer'] },
  { name: 'Construction Site', roles: ['Worker', 'Foreman', 'Architect', 'Engineer', 'Inspector', 'Driver'] },
  { name: 'Fire Station', roles: ['Firefighter', 'Fire Chief', 'Paramedic', 'Dispatcher', 'Instructor', 'Inspector'] },
  { name: 'Ski Resort', roles: ['Skier', 'Ski Instructor', 'Lift Operator', 'Chalet Staff', 'Ski Patrol', 'Equipment Rental'] },
  { name: 'Haunted House', roles: ['Visitor', 'Actor', 'Ticket Seller', 'Manager', 'Special Effects Tech', 'Security'] },
  { name: 'Broadway Show', roles: ['Actor', 'Director', 'Audience Member', 'Usher', 'Stage Manager', 'Makeup Artist'] },
  { name: 'Fashion Show', roles: ['Model', 'Designer', 'Photographer', 'Makeup Artist', 'Audience', 'Stylist'] },
  { name: 'Coffee Shop', roles: ['Barista', 'Customer', 'Manager', 'Regular', 'Student', 'Remote Worker'] },
  { name: 'Recording Studio', roles: ['Musician', 'Producer', 'Sound Engineer', 'Manager', 'Intern', 'Session Player'] },
  { name: 'Vineyard', roles: ['Vintner', 'Tourist', 'Sommelier', 'Harvest Worker', 'Tour Guide', 'Restaurant Chef'] },
  { name: 'Escape Room', roles: ['Player', 'Game Master', 'Designer', 'Actor', 'Receptionist', 'Maintenance'] },
  { name: 'News Station', roles: ['Anchor', 'Camera Operator', 'Producer', 'Intern', 'Weather Person', 'Reporter'] },
  { name: 'Farmer\'s Market', roles: ['Vendor', 'Shopper', 'Organizer', 'Musician', 'Food Truck Owner', 'Produce Farmer'] },
  { name: 'Courtroom', roles: ['Judge', 'Lawyer', 'Defendant', 'Jury Member', 'Stenographer', 'Bailiff'] },
  { name: 'Airport', roles: ['Passenger', 'TSA Agent', 'Pilot', 'Gate Agent', 'Customs Officer', 'Janitor'] },
  { name: 'Veterinary Clinic', roles: ['Vet', 'Pet Owner', 'Vet Tech', 'Receptionist', 'Groomer', 'Pet'] },
  { name: 'Camping Site', roles: ['Camper', 'Park Ranger', 'Tour Guide', 'Wildlife', 'Hiker', 'Campground Host'] }
];

/**
 * Get a random location for a new game
 */
export function getRandomLocation() {
  return LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
}

/**
 * Get a random role from a location
 */
export function getRandomRole(location) {
  const roles = location.roles;
  return roles[Math.floor(Math.random() * roles.length)];
}
