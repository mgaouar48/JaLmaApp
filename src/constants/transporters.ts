export interface Transporter {
    id: string;
    firstName: string;
    lastName: string;
    rating: number;
    capacity: number; // litres
    price: number; // DA
    latitude: number;
    longitude: number;
    available: boolean;
}

// Simulated transporters near Tlemcen (center ≈ 34.8828, -1.3148)
export const TRANSPORTERS: Transporter[] = [
    {
        id: '1',
        firstName: 'Ahmed',
        lastName: 'Benali',
        rating: 4.5,
        capacity: 10000,
        price: 4500,
        latitude: 34.8860,
        longitude: -1.3100,
        available: true,
    },
    {
        id: '2',
        firstName: 'Yacine',
        lastName: 'Menad',
        rating: 4.8,
        capacity: 15000,
        price: 6000,
        latitude: 34.8790,
        longitude: -1.3200,
        available: true,
    },
    {
        id: '3',
        firstName: 'Karim',
        lastName: 'Ziani',
        rating: 3.9,
        capacity: 5000,
        price: 3500,
        latitude: 34.8900,
        longitude: -1.3050,
        available: true,
    },
    {
        id: '4',
        firstName: 'Mohamed',
        lastName: 'Boudiaf',
        rating: 4.2,
        capacity: 20000,
        price: 8000,
        latitude: 34.8750,
        longitude: -1.3300,
        available: true,
    },
    {
        id: '5',
        firstName: 'Omar',
        lastName: 'Cherif',
        rating: 4.7,
        capacity: 10000,
        price: 4800,
        latitude: 34.8920,
        longitude: -1.3180,
        available: true,
    },
    {
        id: '6',
        firstName: 'Rachid',
        lastName: 'Tlemcani',
        rating: 3.5,
        capacity: 5000,
        price: 3200,
        latitude: 34.8780,
        longitude: -1.3020,
        available: true,
    },
    {
        id: '7',
        firstName: 'Sofiane',
        lastName: 'Hadj',
        rating: 4.9,
        capacity: 15000,
        price: 6500,
        latitude: 34.8950,
        longitude: -1.3250,
        available: true,
    },
    {
        id: '8',
        firstName: 'Nabil',
        lastName: 'Ferhat',
        rating: 4.0,
        capacity: 20000,
        price: 7500,
        latitude: 34.8700,
        longitude: -1.3080,
        available: true,
    },
];
