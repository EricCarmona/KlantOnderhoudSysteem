// Mock Database - Login_File and Klant_File
const database = {
  users: [
    {
      id: 'admin1',
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    },
    {
      id: 'customer1',
      username: 'janssen',
      password: 'customer123',
      role: 'customer',
      customerId: 'C001'
    },
    {
      id: 'customer2',
      username: 'bakker',
      password: 'customer123',
      role: 'customer',
      customerId: 'C002'
    },
    {
      id: 'customer3',
      username: 'vries',
      password: 'customer123',
      role: 'customer',
      customerId: 'C003'
    }
  ],

  customers: [
    {
      id: 'C001',
      name: 'Jan Janssen',
      email: 'jan.janssen@email.nl',
      phone: '+31 6 1234 5678',
      address: 'Hoofdstraat 123, 1234 AB Amsterdam',
      lastMaintenance: '2025-08-15',
      nextMaintenance: '2025-11-15',
      maintenanceHistory: [
        {
          id: 'M001',
          date: '2025-08-15',
          description: 'Jaarlijkse service',
          performedBy: 'Technicus A',
          notes: 'Alle systemen gecontroleerd en bijgewerkt'
        },
        {
          id: 'M002',
          date: '2025-05-10',
          description: 'Reparatie',
          performedBy: 'Technicus B',
          notes: 'Defect onderdeel vervangen'
        },
        {
          id: 'M003',
          date: '2025-02-20',
          description: 'Preventief onderhoud',
          performedBy: 'Technicus A',
          notes: 'Standaard controle uitgevoerd'
        }
      ]
    },
    {
      id: 'C002',
      name: 'Marie Bakker',
      email: 'marie.bakker@email.nl',
      phone: '+31 6 2345 6789',
      address: 'Kerkstraat 45, 5678 CD Rotterdam',
      lastMaintenance: '2025-09-01',
      nextMaintenance: '2025-12-01',
      maintenanceHistory: [
        {
          id: 'M004',
          date: '2025-09-01',
          description: 'Kwartaalcontrole',
          performedBy: 'Technicus C',
          notes: 'Geen problemen geconstateerd'
        },
        {
          id: 'M005',
          date: '2025-06-15',
          description: 'Software update',
          performedBy: 'Technicus A',
          notes: 'Systeem bijgewerkt naar nieuwste versie'
        }
      ]
    },
    {
      id: 'C003',
      name: 'Peter de Vries',
      email: 'peter.vries@email.nl',
      phone: '+31 6 3456 7890',
      address: 'Dorpsweg 78, 9012 EF Utrecht',
      lastMaintenance: '2025-07-20',
      nextMaintenance: '2025-10-20',
      maintenanceHistory: [
        {
          id: 'M006',
          date: '2025-07-20',
          description: 'Jaarlijkse inspectie',
          performedBy: 'Technicus B',
          notes: 'Kleine aanpassingen doorgevoerd'
        },
        {
          id: 'M007',
          date: '2025-04-10',
          description: 'Noodservice',
          performedBy: 'Technicus C',
          notes: 'Storing verholpen'
        },
        {
          id: 'M008',
          date: '2025-01-15',
          description: 'Preventief onderhoud',
          performedBy: 'Technicus A',
          notes: 'Routine controle succesvol afgerond'
        }
      ]
    },
    {
      id: 'C004',
      name: 'Sophie Vermeer',
      email: 'sophie.vermeer@email.nl',
      phone: '+31 6 4567 8901',
      address: 'Laan van Zuid 234, 3456 GH Den Haag',
      lastMaintenance: '2025-09-10',
      nextMaintenance: '2025-12-10',
      maintenanceHistory: [
        {
          id: 'M009',
          date: '2025-09-10',
          description: 'Halfjaarlijkse service',
          performedBy: 'Technicus B',
          notes: 'Uitstekende staat van onderhoud'
        }
      ]
    },
    {
      id: 'C005',
      name: 'Thomas Mulder',
      email: 'thomas.mulder@email.nl',
      phone: '+31 6 5678 9012',
      address: 'Parkstraat 56, 6789 IJ Eindhoven',
      lastMaintenance: '2025-08-25',
      nextMaintenance: '2025-11-25',
      maintenanceHistory: [
        {
          id: 'M010',
          date: '2025-08-25',
          description: 'Regulier onderhoud',
          performedBy: 'Technicus C',
          notes: 'Alles naar verwachting'
        },
        {
          id: 'M011',
          date: '2025-05-30',
          description: 'Tussentijdse controle',
          performedBy: 'Technicus A',
          notes: 'Kleine optimalisaties uitgevoerd'
        }
      ]
    }
  ]
};