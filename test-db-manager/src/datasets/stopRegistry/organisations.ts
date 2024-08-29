import {
  StopRegistryOrganisationInput,
  StopRegistryOrganisationType,
} from '../../generated/graphql';

export const seedOrganisations: Array<StopRegistryOrganisationInput> = [
  {
    name: 'JCD',
    organisationType: StopRegistryOrganisationType.Other,
    privateContactDetails: {
      phone: '+358501234567',
      email: 'jcd@example.com',
    },
  },
  {
    name: 'Clear Channel',
    organisationType: StopRegistryOrganisationType.Other,
    privateContactDetails: {
      phone: '+358501223334',
      email: 'clear-channel@example.com',
    },
  },
  {
    name: 'ELY-keskus',
    organisationType: StopRegistryOrganisationType.Other,
    privateContactDetails: {
      phone: '+358501234567',
      email: 'ely-keskus@example.com',
    },
  },
];
